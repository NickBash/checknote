'use client'

import { usePocket } from '@/components/providers/pocket-provider'
import { Spinner } from '@/components/spinner'
import { redirect } from 'next/navigation'
import { useLayoutEffect, useState } from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = usePocket()
  const [isLoading, setIsLoading] = useState(true)

  useLayoutEffect(() => {
    if (!user) {
      return redirect('/')
    }
    setIsLoading(false)
  }, [user])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-full dark:bg-[#1F1F1F]">
      {/* <Navigation /> */}
      <main className="h-full flex-1 overflow-y-auto">
        {/* <SearchCommand /> */}
        {children}
      </main>
    </div>
  )
}

export default MainLayout
