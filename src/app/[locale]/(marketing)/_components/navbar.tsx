import { LangToggle } from '@/components/lang-toggle'
import { ModeToggle } from '@/components/mode-toggle'
import { usePocket } from '@/components/providers/pocket-provider'
import { Spinner } from '@/components/spinner'
import { useScrollTop } from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { User } from './user'

export const Navbar = ({ locale }: { locale: string }) => {
  const { isLoadingUser } = usePocket()
  const scrolled = useScrollTop()

  return (
    <div
      className={cn(
        'items-cemter fixed top-0 z-50 flex w-full bg-background p-6 dark:bg-[#1F1F1F]',
        scrolled && 'border-b shadow-sm',
      )}
    >
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
        <ModeToggle />
        <LangToggle locale={locale} />
        {isLoadingUser ? (
          <div className="mx-3">
            <Spinner />
          </div>
        ) : (
          <User />
        )}
      </div>
    </div>
  )
}
