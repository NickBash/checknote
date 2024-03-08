'use client'

import { ConfirmModal } from '@/components/modals/confirm-modal'
import { usePocket } from '@/components/providers/pocket-provider'
import { Button } from '@/components/ui/button'
import { useDocuments } from '@/hooks/use-documents'
import { useRouter } from 'next/navigation'

interface BannerProps {
  documentId: string
}

export const Banner = ({ documentId }: BannerProps) => {
  const { user, pb } = usePocket()
  const router = useRouter()

  const updateDocuments = useDocuments(state => state.updateDocuments)
  const deleteDocument = useDocuments(state => state.deleteDocument)

  const onRemove = () => {
    deleteDocument(pb, user, documentId)

    router.push('/documents')
  }

  const onRestore = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()

    updateDocuments(pb, user, documentId, { isArchived: false })
  }

  return (
    <div className="flex w-full items-center justify-center gap-x-2 bg-rose-500 p-2 text-center text-sm text-white">
      <p>This page is in the Trash.</p>
      <Button
        size="sm"
        onClick={e => onRestore(e)}
        variant="outline"
        className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  )
}
