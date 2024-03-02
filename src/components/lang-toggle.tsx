'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/navigation'

export function LangToggle({ locale }: { locale: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (value: 'ru' | 'en') => {
    // startTransition(() => {
    //   router.replace(
    //     // @ts-expect-error -- TypeScript will validate that only known `params`
    //     // are used in combination with a given `pathname`. Since the two will
    //     // always match for the current route, we can skip runtime checks.
    //     { pathname, params },
    //     { lng: nextLocale },
    //   )
    // })
    router.push(pathname, { locale: value })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {locale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-5" align="center">
        <DropdownMenuItem onClick={() => handleChange('ru')}>RU</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange('en')}>EN</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
