'use client'

import { useCoverImage } from '@/hooks/use-cover-image'
import { useEdgeStore } from '@/lib/edgestore'
import { cn } from '@/lib/utils'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

interface CoverImageProps {
  url?: string
  preview?: boolean
}

async function requestGetImage(url: string) {
  const body = new FormData()

  body.append('fileName', url)

  try {
    const response = await fetch(`/api/s3/get`, { method: 'POST', body })
    return await response.json()
  } catch (e) {
    console.error(e)
  }
}

export const Cover = ({ preview, url }: CoverImageProps) => {
  const { edgestore } = useEdgeStore()
  const params = useParams()
  //const coverImage = useCoverImage()
  const coverImage = null
  const getUrlImage = useCoverImage(state => state.requestGetImage)
  const setUrlImage = useCoverImage(state => state.setUrlImage)
  const urlImage = useCoverImage(state => state.url)

  useEffect(() => {
    if (url) {
      setUrlImage(url)
    } else {
      setUrlImage(null)
    }
  }, [url, setUrlImage])

  const onRemove = async () => {
    // if (url) {
    //   await edgestore.publicFiles.delete({
    //     url: url,
    //   })
    // }
    // removeCoverImage({
    //   id: params.documentId as Id<'documents'>,
    // });
  }

  return (
    <div className={cn('group relative h-[35vh] w-full', !url && 'h-[12vh]', url && 'bg-muted')}>
      {!!urlImage && <Image src={urlImage} fill alt="Cover" className="object-cover" />}
      {urlImage && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button onClick={() => {}} className="text-xs text-muted-foreground" variant="outline" size="sm">
            <ImageIcon className="mr-2 h-4 w-4" />
            Change cover
          </Button>
          <Button onClick={onRemove} className="text-xs text-muted-foreground" variant="outline" size="sm">
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="h-[12vh] w-full" />
}
