'use client'

import { LangToggle } from '@/components/lang-toggle'
import ModeToggle from '@/components/mode-toggle'
import { Logo } from '../../(marketing)/_components/logo'

interface Root {
  children: React.ReactNode
  params: { locale: string }
}

const AuthLayout = ({ children, params }: Root) => {
  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      <div className="fixed top-0 z-50 flex w-full items-center bg-background p-6 dark:bg-[#1F1F1F]">
        <Logo />
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
