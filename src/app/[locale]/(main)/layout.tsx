'use client'

import { SearchCommand } from '@/components/search-command'
import { Spinner } from '@/components/spinner'
import { useDocuments } from '@/stores/use-documents.store'
import { useSharedDocuments } from '@/stores/use-shared-documents'
import { useUserStore } from '@/stores/use-user.store'
import { useEffect } from 'react'
import Navigation from './_components/navigation'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const userStore = useUserStore()
  const isLoadingDocuments = useDocuments(state => state.isLoading)

  const getAllDocuments = useDocuments(state => state.requestGetDocuments)
  const requestGetSharedDocuments = useSharedDocuments(state => state.requestGetDocuments)

  const getAll = async () => {
    await getAllDocuments()
    await requestGetSharedDocuments()
  }

  useEffect(() => {
    if (userStore.user && !userStore.isLoadingUser) {
      getAll()
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
      {/* <SheetTask /> */}
    </div>
  )
}

export default MainLayout
