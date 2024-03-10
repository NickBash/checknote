'use client'

import { usePocket } from '@/components/providers/pocket-provider'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Logo } from './logo'

export const Heading = () => {
  const t = useTranslations('Marketing')
  const { user } = usePocket()

  const [init, setInit] = useState(false)

  useEffect(() => {
    setInit(true)
  }, [])

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold sm:text-5xl md:text-6xl">
        {t('title')}
        <div className="mt-2 flex justify-center">
          <Logo />
        </div>
      </h1>
      <h3 className="md:text-axl text-base font-medium sm:text-xl">{t('desc')}</h3>
      <div className="flex h-24 items-center justify-center">
        {!init && (
          <div className="w-fill flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}
        {user && init && (
          <Button asChild>
            <Link href="/documents">
              {t('Enter')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
        {!user && init && (
          <Button>
            <Link href="/signin" className="flex">
              {t('enterNote')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
