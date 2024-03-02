'use client'

import { Navbar } from './_components/navbar'

interface Root {
  children: React.ReactNode
  params: { lng: string }
}

const MarketingLayout = ({ children, params }: Root) => {
  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      <Navbar locale={params.lng} />
      <main className="h-full pt-40">{children}</main>
    </div>
  )
}

export default MarketingLayout
