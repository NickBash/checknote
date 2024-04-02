'use client'

import { useCoverImage } from '@/hooks/use-cover-image'
import { useDocuments } from '@/stores'
import { useS3 } from '@/stores/use-s3.store'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { SingleImageDropzone } from '../single-image-dropzone'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'

export const CoverImageModal = () => {
  const { documentId } = useParams()

  const requestUpdateDocument = useDocuments(state => state.requestUpdateDocument)

  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const coverImage = useCoverImage()

  const uploadFile = useS3(state => state.uploadFile)

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    coverImage.onClose()
  }

  const onChange = async (file?: File) => {
    if (file) {
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
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone className="w-full outline-none" disabled={isSubmitting} value={file} onChange={onChange} />
      </DialogContent>
    </Dialog>
  )
}
