'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useDocuments, useEditorsModal, type DocumentCopy } from '@/stores'
import { PersonIcon } from '@radix-ui/react-icons'
import { MoreHorizontal, Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface MenuProps {
  initialData: DocumentCopy
}

export const Menu = ({ initialData }: MenuProps) => {
  const t = useTranslations('Menu')

  const onArchiveDocuments = useDocuments(state => state.onArchiveDocuments)
  const onOpenEditors = useEditorsModal(state => state.onOpen)

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!initialData.id) return

    onArchiveDocuments(initialData.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" alignOffset={8} forceMount>
        <DropdownMenuItem onClick={() => onOpenEditors(initialData)}>
          <PersonIcon className="mr-2 h-4 w-4" />
          {t('sharedPerson')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="mr-2 h-4 w-4" />
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkelton() {
  return <Skeleton className="h-10 w-10" />
}
