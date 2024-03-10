'use client'

import { usePocket } from '@/components/providers/pocket-provider'
import { Spinner } from '@/components/spinner'
import Navigation from './_components/navigation'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoadingUser, user } = usePocket()

  if (isLoadingUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
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
