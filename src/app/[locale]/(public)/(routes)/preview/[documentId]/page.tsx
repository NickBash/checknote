'use client'

import BlockEditorPreview from '@/components/BlockEditor/BlockEditorPreview'
import { Cover } from '@/components/cover'
import { Spinner } from '@/components/spinner'
import { Toolbar } from '@/components/toolbar'
import { usePublishedDocument } from '@/stores'
import { HocuspocusProvider, type TiptapCollabProvider } from '@hocuspocus/provider'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import * as Y from 'yjs'

interface DocumentIdPageProps {
  params: {
    documentId: string
  }
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const [provider, setProvider] = useState<TiptapCollabProvider | HocuspocusProvider | null>(null)
  const searchParams = useSearchParams()

  const publishedDocument = usePublishedDocument(state => state.document)
  const requestGetOneDocument = usePublishedDocument(state => state.requestGetOneDocument)
  const isLoadingPublishedDocument = usePublishedDocument(state => state.isLoading)

  useEffect(() => {
    requestGetOneDocument(params.documentId)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasCollab = parseInt(searchParams.get('noCollab') as string) !== 1

  const ydoc = useMemo(() => new Y.Doc(), [])

  useEffect(() => {
    if (hasCollab && publishedDocument) {
      setProvider(
        new HocuspocusProvider({
          url: process.env.NEXT_PUBLIC_HOCUSPOCUS_URL!,
          name: publishedDocument?.contentId as string,
          document: ydoc,
          forceSyncInterval: 200,
        }),
      )
    }

    return () => provider?.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishedDocument])

  if (isLoadingPublishedDocument) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (publishedDocument === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Not found</p>
      </div>
    )
  }

  if (hasCollab && !provider) return

  return (
    <div className="pb-40">
      <Cover url={publishedDocument?.coverImage} documentId={params.documentId} preview />
      <div className="mx-auto">
        <Toolbar initialData={publishedDocument} documentId={params.documentId} preview />
        <BlockEditorPreview hasCollab={hasCollab} ydoc={ydoc} provider={provider} />
      </div>
    </div>
  )
}

export default DocumentIdPage
