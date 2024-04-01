'use client'

import { Button } from '@/components/ui/button'
import { useDocuments } from '@/stores/use-documents.store'
import { PlusCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

const DocumentPage = () => {
  const t = useTranslations('startDocument')

  const createDocument = useDocuments(state => state.requestСreateDocument)

  const onCreate = () => {
    createDocument()
  }

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <h2 className="text-lg font-medium">{t('title')}</h2>
      <Button onClick={onCreate}>
        <PlusCircle className="mr-2 h-4 w-4" />
        {t('createNote')}
      </Button>
    </div>
  )
}

export default DocumentPage
