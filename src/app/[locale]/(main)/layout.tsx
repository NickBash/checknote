'use client'

import { Spinner } from '@/components/spinner'
import { useUserStore } from '@/stores/use-user.store'
import Navigation from './_components/navigation'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const userStore = useUserStore()

  if (userStore.isLoadingUser) {
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
      <main className="h-full flex-1 overflow-y-auto">
        {/* <SearchCommand /> */}
        {children}
      </main>
    </div>
  )
}

export default MainLayout
