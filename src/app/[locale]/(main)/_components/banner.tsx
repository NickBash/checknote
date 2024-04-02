'use client'

import { ConfirmModal } from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { useDocuments } from '@/stores'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface BannerProps {
  documentId: string
}

export const Banner = ({ documentId }: BannerProps) => {
  const t = useTranslations('BannerDelete')
  const router = useRouter()

  const updateDocuments = useDocuments(state => state.requestUpdateDocument)
  const deleteDocument = useDocuments(state => state.requestDeleteDocument)

  const onRemove = () => {
    deleteDocument(documentId)

    router.push('/documents')
  }

  const onRestore = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()

    updateDocuments(documentId, { isArchived: false })
  }

  return (
    <div className="flex w-full items-center justify-center gap-x-2 bg-rose-500 p-2 text-center text-sm text-white">
      <p>{t('title')}</p>
      <Button
        size="sm"
        onClick={e => onRestore(e)}
        variant="outline"
        className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white"
      >
        {t('restorePageButton')}
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:bg-primary/5 hover:text-white"
        >
          {t('deleteForever')}
        </Button>
      </ConfirmModal>
    </div>
  )
}
