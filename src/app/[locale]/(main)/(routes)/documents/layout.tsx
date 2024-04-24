'use client'

import { cn } from '@/lib/utils'
import { useNavigationStore } from '@/stores'
import { MenuIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useMediaQuery } from 'usehooks-ts'
import { Navbar } from '../../_components/navbar'

const DocumentLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams()

  const isMobile = useMediaQuery('(max-width: 768px)')

  const isCollapsed = useNavigationStore(state => state.isCollapsed)
  const isResetting = useNavigationStore(state => state.isResetting)
  const onChangeCollapse = useNavigationStore(state => state.onChangeCollapse)

  return (
    <>
      <div
        className={cn(
          'absolute left-0 top-0 z-20 w-full',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'left-0 w-full',
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={onChangeCollapse} />
        ) : (
          <nav className="w-full bg-transparent px-3 py-2">
            {isCollapsed && (
              <MenuIcon onClick={onChangeCollapse} role="button" className="h-6 w-6 text-muted-foreground" />
            )}
          </nav>
        )}
      </div>
      {children}
    </>
  )
}

export default DocumentLayout
