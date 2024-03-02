'use client'

import { usePocket } from '@/components/providers/pocket-provider'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const Heading = ({ lng }: { lng: string }) => {
  const t = useTranslations('Marketing')
  const { user } = usePocket()

  const [init, setInit] = useState(false)

  useEffect(() => {
    setInit(true)
  }, [])

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold sm:text-5xl md:text-6xl">
        {t('title')}
        <span className="underline">CHECKNOTE</span>
      </h1>
      <h3 className="md:text-axl text-base font-medium sm:text-xl">{t('desc')}</h3>
      {!init && (
        <div className="w-fill flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {/* {user && init && (
        <Button asChild>
          <Link href="/documents">
            Enter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )} */}
      {user && init && (
        <Button asChild>
          <Link href="/signin">
            {t('Enter')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
      {!user && init && (
        <Button>
          <Link href="/signin">
            Get Note free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}
