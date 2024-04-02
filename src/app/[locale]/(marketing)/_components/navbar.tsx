import { LangToggle } from '@/components/lang-toggle'
import ModeToggle from '@/components/mode-toggle'
import { Spinner } from '@/components/spinner'
import { useScrollTop } from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/use-user.store'
import { Logo } from './logo'
import { User } from './user'

export const Navbar = ({ locale }: { locale: string }) => {
  const isLoadingUser = useUserStore(state => state.isLoadingUser)
  const scrolled = useScrollTop()

  return (
    <div
      className={cn(
        'fixed top-0 z-50 flex w-full items-center bg-background p-6 dark:bg-[#1F1F1F]',
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
