'use client'

import { LangToggle } from '@/components/lang-toggle'
import ModeToggle from '@/components/mode-toggle'
import { Spinner } from '@/components/spinner'
import { useUserStore } from '@/stores'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo } from '../../(marketing)/_components/logo'

interface Root {
  children: React.ReactNode
  params: { locale: string }
}

const AuthLayout = ({ children, params }: Root) => {
  const router = useRouter()

  const user = useUserStore(state => state.user)
  const isLoadingUser = useUserStore(state => state.isLoadingUser)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      router.push('/')
    }

    if (!isLoadingUser && !user) {
      setIsLoading(false)
    }

    if (isLoadingUser) {
      setIsLoading(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoadingUser])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner></Spinner>
      </div>
    )
  }

  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      <div className="fixed top-0 z-50 flex w-full items-center bg-background p-6 dark:bg-[#1F1F1F]">
        <Logo onClick={() => router.push('/')} />
        <div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
          <ModeToggle />
          <LangToggle locale={params.locale} />
        </div>
      </div>
      <main className="h-full0">{children}</main>
    </div>
  )
}

export default AuthLayout
