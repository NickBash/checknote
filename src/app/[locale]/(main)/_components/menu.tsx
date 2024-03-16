'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserStore } from '@/stores/use-user.store'
import { MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MenuProps {
  documentId: string
}

export const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter()

  const user = useUserStore(state => state.user)

  // const archive = useMutation(api.documents.archive)

  const onArchive = () => {
    // const promise = archive({ id: documentId })
    // toast.promise(promise, {
    //   loading: 'Moving to trash...',
    //   success: 'Note moved to trash!',
    //   error: 'Failed to archive note.',
    // })
    // router.push('/documents')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" alignOffset={8} forceMount>
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <div className="p-2 text-xs text-muted-foreground">Last edited by: {user?.fullName}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkelton() {
  return <Skeleton className="h-10 w-10" />
}
