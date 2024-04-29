'use client'

import { ChevronsLeftRight } from 'lucide-react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/stores/use-user.store'

export const UserItem = () => {
  const user = useUserStore(state => state.user)

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex w-full items-center justify-between py-3 pl-3 pr-9 text-sm hover:bg-primary/5"
        >
          <div className="flex max-w-[250px] items-center gap-x-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user?.avatar} />
            </Avatar>
            <span className="line-clamp-1 text-start font-medium">{user?.username}</span>
          </div>
          <ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start" alignOffset={11} forceMount>
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">{user?.email}</p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="line-clamp-1 text-sm">{user?.username}</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground">
          <div>{/* <SignOutButton>Log out</SignOutButton> */}</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
