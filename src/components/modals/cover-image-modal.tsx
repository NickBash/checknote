'use client'

import { useCoverImage } from '@/hooks/use-cover-image'
import { useDocuments } from '@/stores'
import { useS3 } from '@/stores/use-s3.store'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SingleImageDropzone } from '../single-image-dropzone'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'

export const CoverImageModal = () => {
  const t = useTranslations('Cover')

  const { documentId } = useParams()

  const requestUpdateDocument = useDocuments(state => state.requestUpdateDocument)

  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const coverImage = useCoverImage()

  const uploadFile = useS3(state => state.uploadFile)

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    coverImage.onClose()
  }

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true)
      const res = await uploadFile(file, documentId as string)

      if (res.status) {
        requestUpdateDocument(documentId as string, { coverImage: res.name })
      }

      onClose()
    }
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">{t('coverImage')}</h2>
        </DialogHeader>
        <SingleImageDropzone className="w-full outline-none" disabled={isSubmitting} value={file} onChange={onChange} />
      </DialogContent>
    </Dialog>
  )
}
