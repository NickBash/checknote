'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useSearch } from '@/hooks/use-search'
import { useSettings } from '@/hooks/use-settings'
import { cn } from '@/lib/utils'
import { useDocuments, useNavigationStore, useUserStore } from '@/stores'
import { ChevronsLeft, Plus, PlusCircle, Search, Trash, User2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

import { useEffect, useRef, type ElementRef } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { DocumentList } from './document-list'
import { Item } from './item'
import { SharedDocumentList } from './shared-document-list'
import { TrashBox } from './trash-box'
import { UserItem } from './user-item'

const Navigation = () => {
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const router = useRouter()

  const isMobile = useMediaQuery('(max-width: 768px)')

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)

  const isResetting = useNavigationStore(state => state.isResetting)
  const setIsResetting = useNavigationStore(state => state.setIsResetting)

  const setIsCollapsed = useNavigationStore(state => state.setIsCollapsed)
  const changeCollapse = useNavigationStore(state => state.changeCollapse)

  const onOpenSettings = useSettings(state => state.onOpen)
  const onOpenSearch = useSearch(state => state.onOpen)

  const requestСreateDocument = useDocuments(state => state.requestСreateDocument)

  const user = useUserStore(state => state.user)

  const resetWidth = () => {
    if (sidebarRef.current) {
      setIsResetting(true)
      setIsCollapsed(false)

      sidebarRef.current.style.width = isMobile ? '100%' : '240px'
      setTimeout(() => setIsResetting(false), 300)
    }
  }

  useEffect(() => {
    resetWidth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeCollapse])

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isMobile])

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()

    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return
    let newWidth = event.clientX

    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const collapse = () => {
    if (sidebarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = '0'
      setTimeout(() => setIsResetting(false), 300)
    }
  }

  const handleCreate = () => {
    requestСreateDocument()
  }

  const redirectToTeamManagement = () => {
    router.push('/team-management')
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar relative z-[99999] flex h-full w-60 flex-col overflow-y-auto bg-secondary',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'w-0',
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            'absolute right-2 top-3 h-6 w-6 rounded-sm text-muted-foreground opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:hover:bg-neutral-600',
            isMobile && 'opacity-100',
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item label={t('search')} icon={Search} isSearch onClick={onOpenSearch} />
          {/* <Item label={t('settings')} icon={Settings} onClick={onOpenSettings} /> */}
          <Item onClick={handleCreate} label={t('newPage')} icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <Item onClick={redirectToTeamManagement} icon={User2} label={t('teamManagement')} />
        </div>
        <div className="mt-4">
          <DocumentList />

          <Item onClick={handleCreate} icon={Plus} label={t('addPage')} />

          <p className="mb-1 mt-4 pl-8 text-sm font-medium text-muted-foreground">Поделились с вами</p>
          <SharedDocumentList className="max-h-40 overflow-y-auto" userId={user?.id} />
          <Popover>
            <PopoverTrigger className="mt-4 w-full">
              <Item label={t('trash')} icon={Trash} />
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" side={isMobile ? 'bottom' : 'right'}>
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
        />
      </aside>
    </>
  )
}

export default Navigation
