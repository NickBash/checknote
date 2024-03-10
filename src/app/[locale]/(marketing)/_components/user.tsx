'use client'

import { usePocket } from '@/components/providers/pocket-provider'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PersonIcon } from '@radix-ui/react-icons'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function User() {
  const t = useTranslations('Marketing')
  const { logout, user } = usePocket()

  const userAuthDropdown = (
    <>
      <DropdownMenuItem asChild>
        <Link href="/documents" className="cursor-pointer justify-center">
          {t('toDoc')}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Button onClick={logout} size="sm" variant="destructive" className="h-[32px] w-full cursor-pointer">
          {t('logout')}
        </Button>
      </DropdownMenuItem>
    </>
  )

  const userUnauthDropdown = (
    <>
      <DropdownMenuItem asChild>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
          asChild
        >
          <Link href="/signin">{t('enterNote')}</Link>
        </Button>
      </DropdownMenuItem>
    </>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        >
          <PersonIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-2">
        {user ? userAuthDropdown : userUnauthDropdown}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
