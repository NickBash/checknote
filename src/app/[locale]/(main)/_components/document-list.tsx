'use client'

import { cn } from '@/lib/utils'
import { useDocuments } from '@/stores'
import { FileIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Item } from './item'

interface IDocumentListProps {
  level?: number
  parentDocumentId?: string
}

export const DocumentList = ({ level = 0, parentDocumentId }: IDocumentListProps) => {
  const t = useTranslations('DocumentList')
  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const listDocuments = useDocuments(state => state.listDocuments)
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

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  if (!listDocuments) {
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
        {t('noPageInside')}
      </p>
      {displayDocuments.map(document => (
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
          {expanded[document.id] && <DocumentList parentDocumentId={document.id} level={level + 1} />}
        </div>
      ))}
    </>
  )
}
