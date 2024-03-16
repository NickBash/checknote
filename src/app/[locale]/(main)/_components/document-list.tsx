'use client'

import { Document, useDocuments } from '@/hooks/use-documents'
import { cn } from '@/lib/utils'
import { usePocketbaseStore } from '@/stores/use-pocketbase.store'
import { useUserStore } from '@/stores/use-user.store'
import { FileIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Item } from './item'

interface IDocumentListProps {
  level?: number
}

export const DocumentList = ({ level = 0 }: IDocumentListProps) => {
  const pb = usePocketbaseStore(state => state.pocketbaseClient)
  const user = useUserStore(state => state.user)
  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [documentsList, setDocumentsList] = useState<Document[]>([])

  const { getDocuments, isLoading, addDocument, updateDocument, deleteDocumentState } = useDocuments()

  const documents = useDocuments(state => state.documents)

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }))
  }

  useEffect(() => {
    if (!isLoading) {
      getDocuments(pb, user)

      pb?.collection('documents').subscribe('*', e => {
        console.log(e)
        if (e?.action === 'create') {
          addDocument(e?.record as Document)
        }
        if (e?.action === 'update') {
          updateDocument(e?.record as Document)
        }
        if (e?.action === 'delete') {
          deleteDocumentState(e?.record as Document)
        }
      })
    }

    return () => {
      pb?.collection('documents').unsubscribe('*')
    }
  }, [])

  useEffect(() => {
    if (documents?.length) {
      setDocumentsList(documents.filter(doc => !doc.isArchived))
    } else {
      setDocumentsList([])
    }
  }, [documents])

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  if (!documents) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden',
        )}
      >
        No page inside
      </p>
      {documentsList.map(document => (
        <div key={document.id}>
          <Item
            id={document.id}
            onClick={() => onRedirect(document.id)}
            document={document}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document.id}
            level={level}
            onExpand={() => onExpand(document.id)}
            expanded={expanded[document.id]}
          />
          {/*
          {expanded[document.id] && <DocumentList parentDocumentId={document.id} level={level + 1} />} */}
        </div>
      ))}
    </>
  )
}
