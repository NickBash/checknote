'use client'

import { Cover } from '@/components/cover'
import { Toolbar } from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { useDocuments, type Document } from '@/hooks/use-documents'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'

interface DocumentIdPageProps {
  params: {
    documentId: string
  }
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const documentsList = useDocuments(state => state.documents)

  const Editor = useMemo(() => dynamic(() => import('@/components/editor'), { ssr: false }), [])

  const [documentCopy, setDocumentCopy] = useState<Document | null>(null)

  useEffect(() => {
    const findDoc = documentsList.find((doc: Document) => doc.id === params.documentId)

    if (findDoc) {
      setDocumentCopy(findDoc)
    }
  }, [])

  const onChange = (content: string) => {
    // update({
    //   id: params.documentId,
    //   content,
    // });
  }

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <div className="pb-40">
      <Cover preview url={document.coverImage} />
      <div className="lg:md-max-w-4xl mx-auto md:max-w-3xl">
        <Toolbar preview initialData={document} />
        <Editor editable={false} onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  )
}

export default DocumentIdPage
