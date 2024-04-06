'use client'

import { SearchCommand } from '@/components/search-command'
import { Spinner } from '@/components/spinner'
import { useDocuments, type DocumentCopy } from '@/stores/use-documents.store'
import { usePocketbaseStore } from '@/stores/use-pocketbase.store'
import { useUserStore } from '@/stores/use-user.store'
import { useEffect } from 'react'
import Navigation from './_components/navigation'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const userStore = useUserStore()
  const pb = usePocketbaseStore(state => state.pocketbaseClient)
  const addDocument = useDocuments(state => state.addDocument)
  const updateDocument = useDocuments(state => state.updateDocument)
  const deleteDocument = useDocuments(state => state.deleteDocument)
  const isLoadingDocuments = useDocuments(state => state.isLoading)

  const getAllDocuments = useDocuments(state => state.requestGetDocuments)

  useEffect(() => {
    if (userStore.user && !userStore.isLoadingUser) {
      getAllDocuments()

      pb?.collection('documents').subscribe('*', e => {
        if (e?.action === 'create') {
          addDocument(e?.record as DocumentCopy)
        }
        if (e?.action === 'update') {
          updateDocument(e?.record as DocumentCopy)
        }
        if (e?.action === 'delete') {
          deleteDocument((e?.record as DocumentCopy).id)
        }
      })
    }

    return () => {
      pb?.collection('documents').unsubscribe('*')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.user, userStore.isLoadingUser])

  if (userStore.isLoadingUser || isLoadingDocuments) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!userStore.user) {
    return null
  }

  return (
    <div className="flex h-full dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="relative h-full flex-1 overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout
