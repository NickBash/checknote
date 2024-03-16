'use client'

import { useCoverImage } from '@/hooks/use-cover-image'
import { useDocuments } from '@/hooks/use-documents'
import { usePocketbaseStore } from '@/stores/use-pocketbase.store'
import { useUserStore } from '@/stores/use-user.store'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { SingleImageDropzone } from '../single-image-dropzone'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'

async function uploadFile(file: File, documentId: string) {
  const body = new FormData()

  const response = await fetch('/api/s3', { method: 'POST', body })
  return await response.json()
}

export const CoverImageModal = () => {
  const pb = usePocketbaseStore(state => state.pocketbaseClient)
  const user = useUserStore(state => state.user)
  const { documentId } = useParams()

  const updateDocuments = useDocuments(state => state.updateDocuments)

  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const coverImage = useCoverImage()

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    coverImage.onClose()
  }

  const onChange = async (file?: File) => {
    if (file) {
      const res = await uploadFile(file, documentId as string)

      if (res.status) {
        updateDocuments(pb as any, user, documentId as string, { coverImage: res.src })
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
