import { LangToggle } from '@/components/lang-toggle'
import { ModeToggle } from '@/components/mode-toggle'
import { usePocket } from '@/components/providers/pocket-provider'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { useScrollTop } from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import { UserButton } from '@clerk/clerk-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Logo } from './logo'

export const Navbar = ({ locale }: { locale: string }) => {
  const scrolled = useScrollTop()
  const [init, setInit] = useState(false)
  const t = useTranslations('Marketing')

  const { user } = usePocket()

  useEffect(() => {
    setInit(true)
  }, [])

  return (
    <div
      className={cn(
        'items-cemter fixed top-0 z-50 flex w-full bg-background p-6 dark:bg-[#1F1F1F]',
        scrolled && 'border-b shadow-sm',
      )}
    >
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
        {!init && (
          <div className="pr-2">
            <Spinner />
          </div>
        )}
        {init && !user && (
          <Button size="sm" asChild>
            <Link href="/signin">Log in</Link>
          </Button>
        )}
        {init && user && (
          <>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/documents">{t('enterNote')}</Link>
            </Button>
            <UserButton afterSignOutUrl="/"></UserButton>
          </>
        )}
        <ModeToggle />
        <LangToggle locale={locale} />
      </div>
    </div>
  )
}
