'use client'

import { usePocket } from '@/components/providers/pocket-provider'
import { SearchCommand } from '@/components/search-command'
import { redirect } from 'next/navigation'
import Navigation from './_components/navigation'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = usePocket()

  // if (isLoading) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <Spinner size="lg" />
  //     </div>
  //   );
  // }

  console.log(user)

  if (!user) {
    return redirect('/')
  }

  return (
    <div className="flex h-full dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="h-full flex-1 overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout
