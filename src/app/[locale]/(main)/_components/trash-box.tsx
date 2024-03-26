'use client'

import { ConfirmModal } from '@/components/modals/confirm-modal'
import { Spinner } from '@/components/spinner'
import { Input } from '@/components/ui/input'
import { useDocuments, type DocumentCopy } from '@/stores'
import { Search, Trash, Undo } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const TrashBox = () => {
  const router = useRouter()
  const params = useParams()

  const listDocuments = useDocuments(state => state.listDocuments)
  const requestUpdateDocuments = useDocuments(state => state.requestUpdateDocument)
  const requestDeleteDocument = useDocuments(state => state.requestDeleteDocument)

  const [search, setSearch] = useState('')
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentCopy[]>([])

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  const onRestore = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, documentId: string) => {
    event.stopPropagation()

    requestUpdateDocuments(documentId, { isArchived: false })
  }

  const onRemove = (documentId: string) => {
    requestDeleteDocument(documentId)

    if (params.documentId === documentId) {
      router.push('/documents')
    }
  }

  useEffect(() => {
    let findDocs: DocumentCopy[] | undefined

    if (search) {
      findDocs = listDocuments?.filter(
        document => document.title.toLowerCase().includes(search.toLowerCase()) && document.isArchived,
      )
    } else {
      findDocs = listDocuments?.filter(document => document.isArchived)
    }

    if (findDocs?.length) {
      setFilteredDocuments(findDocs)
    } else {
      setFilteredDocuments([])
    }
  }, [search, listDocuments])

  if (!listDocuments) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Spinner size="lg"></Spinner>
      </div>
    )
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-7 bg-secondary px-2 focus-visible:ring-transparent"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden pb-2 text-center text-xs text-muted-foreground last:block">No documents found.</p>
        {filteredDocuments?.map(document => (
          <div
            key={document.id}
            role="button"
            onClick={() => onClick(document.id)}
            className="flex w-full items-center justify-between rounded-sm text-sm text-primary hover:bg-primary/5"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                onClick={e => onRestore(e, document.id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document.id)}>
                <div role="button" className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
