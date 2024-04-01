'use client'

import { memo } from 'react'
import { Navbar } from './_components/navbar'

interface Root {
  children: React.ReactNode
  params: { locale: string }
}

const MarketingLayout = ({ children, params }: Root) => {
  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      <Navbar locale={params.locale} />
      <main className="h-full pt-40">{children}</main>
    </div>
  )
}

export default memo(MarketingLayout)
