'use client'

import { useCoverImage } from '@/hooks/use-cover-image'
import { cn } from '@/lib/utils'
import { useDocuments } from '@/stores'
import { useS3 } from '@/stores/use-s3.store'
import { ImageIcon, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

interface CoverImageProps {
  url?: string
  preview?: boolean
  documentId: string
  sharedMode?: boolean
}

export const Cover = ({ preview, url, documentId, sharedMode }: CoverImageProps) => {
  const t = useTranslations('Cover')

  const [urlImage, setUrlImage] = useState<string | null>(null)

  const getUrlS3 = useS3(state => state.getUrl)
  const urlS3 = useS3(state => state.url)
  const removeFile = useS3(state => state.removeFile)
  const requestUpdateDocument = useDocuments(state => state.requestUpdateDocument)

  const coverImage = useCoverImage()

  useEffect(() => {
    if (!urlS3) {
      getUrlS3()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (url && urlS3) {
      setUrlImage(urlS3 + url)
    }
  }, [url, urlS3])

  const onRemove = async () => {
    if (url) {
      const res = await removeFile(url)

      if (res?.status) {
        requestUpdateDocument(documentId, { coverImage: '' }, sharedMode)

        setUrlImage(null)
      }
    }
  }

  return (
    <div className={cn('group relative h-[35vh] w-full', !url && 'h-[12vh]', url && 'bg-muted')}>
      {!!urlImage && <Image src={urlImage} fill alt="Cover" className="object-cover" />}
      {urlImage && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            onClick={() => coverImage.onOpen(sharedMode)}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {t('changeCover')}
          </Button>
          <Button onClick={onRemove} className="text-xs text-muted-foreground" variant="outline" size="sm">
            <X className="mr-2 h-4 w-4" />
            {t('remove')}
          </Button>
        </div>
      )}
    </div>
  )
}

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="h-[12vh] w-full" />
}
