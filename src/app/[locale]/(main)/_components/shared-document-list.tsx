'use client'

import { cn } from '@/lib/utils'
import { useSharedDocuments } from '@/stores/use-shared-documents'
import { FileIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SharedItem } from './shared-item'

interface IDocumentListProps {
  level?: number
  parentDocumentId?: string
  className?: string
}

export const SharedDocumentList = ({ level = 0, parentDocumentId, className }: IDocumentListProps) => {
  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const listDocuments = useSharedDocuments(state => state.listDocuments)
  const displayDocuments = useMemo(
    () =>
      listDocuments
        .filter(doc => !doc.isArchived)
        .filter(doc => {
          if (!parentDocumentId && doc.parentDocument) {
            return false
          }
          if (parentDocumentId) {
            if (doc.parentDocument) {
              return parentDocumentId === doc.parentDocument
            } else {
              return false
            }
          }

          return true
        }),
    [listDocuments, parentDocumentId],
  )

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }))
  }

  useEffect(() => {
    console.log('sdsdasd')
  }, [])

  const onRedirect = (documentId: string) => {
    router.push(`/shared/${documentId}`)
  }

  const requestGetSharedDocuments = useSharedDocuments(state => state.requestGetDocuments)

  useEffect(() => {
    //requestGetSharedDocuments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log(displayDocuments)
  }, [displayDocuments])

  if (!listDocuments) {
    return (
      <>
        <SharedItem.Skeleton level={level} />
        {level === 0 && (
          <>
            <SharedItem.Skeleton level={level} />
            <SharedItem.Skeleton level={level} />
          </>
        )}
      </>
    )
  }

  return (
    <div className={className}>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : `12px` }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden',
        )}
      >
        No page inside
      </p>
      {displayDocuments.map(document => (
        <div key={document.id}>
          <SharedItem
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
          {expanded[document.id] && <SharedDocumentList parentDocumentId={document.id} level={level + 1} />}
        </div>
      ))}
    </div>
  )
}
