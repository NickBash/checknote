'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useTeamManagementStore, useUserStore, type TeamManagementItem, type UserDB } from '@/stores'
import { MoreVertical, Save, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { SearchUserItem } from './SearchUserItem'

interface Props {
  team: TeamManagementItem
}

export const TeamItem = ({ team }: Props) => {
  const t = useTranslations('EditorsModal')

  const requestRemoveTeam = useTeamManagementStore(state => state.requestRemoveTeam)
  const requestUpdateTeam = useTeamManagementStore(state => state.requestUpdateTeam)

  const findUser = useUserStore(state => state.findUser)
  const user = useUserStore(state => state.user)

  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState<UserDB[]>([])
  const [filterUser, setFilterUser] = useState('')

  const [title, setTitle] = useState(team.name)
  const [editingTitle, setEditingTitle] = useState(false)

  // восстановить инпут, setFilterUser
  const users = useMemo(() => {
    const u = team?.expand?.users?.filter(user => user.email.includes(filterUser))

    return Array.isArray(u) ? u : []
  }, [team, filterUser])

  const onSearch = async () => {
    if (search) {
      const result: UserDB[] = await findUser(search)

      setSearchResult(result?.filter(u => u?.email !== user?.email)?.filter(u => !team?.users?.includes(u.id)))
    }
  }

  const onRemoveUser = (id: string) => {
    const teamChange = { ...team.usersRoles }

    delete teamChange[id]

    const changeTeam = {
      ...team,
      users: team.users?.filter(u => u !== id),
      usersRoles: teamChange,
    }

    requestUpdateTeam(changeTeam)?.then(() => {
      toast.success('Пользователь удален')
    })
  }

  const onUpdateUser = (id: string, role: string) => {
    const changeTeam = {
      ...team,
      usersRoles: { ...team.usersRoles, [id]: role },
    }

    requestUpdateTeam(changeTeam)?.then(() => {
      toast.success('Пользователь обновлен')
    })
  }

  const onAddUser = (id: string, role: string) => {
    const changeTeam = {
      ...team,
      users: [...team.users, id],
      usersRoles: { ...team.usersRoles, [id]: role },
    }

    requestUpdateTeam(changeTeam)?.then(() => {
      toast.success('Пользователь добавлен')
    })
  }

  const onSave = () => {
    const changeTeam = {
      ...team,
      name: title,
    }

    requestUpdateTeam(changeTeam)?.then(() => {
      setEditingTitle(false)
    })
  }

  return (
    <div
      key={team.id}
      className="flex cursor-pointer select-none flex-col items-center gap-x-4 gap-y-2 rounded-sm bg-secondary px-4 py-2"
    >
      <div className="flex w-full items-center justify-between">
        {!editingTitle && (
          <div className="inline-flex" onClick={() => setEditingTitle(true)}>
            {team.name}
          </div>
        )}
        {editingTitle && (
          <div className="inline-flex items-center gap-x-2">
            <Input className="h-6 w-40" value={title} onChange={e => setTitle(e.target.value)} />
            <Save size={20} onClick={onSave} />
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus-visible:ring-transparent">
            <MoreVertical className="rounded-sm p-1 hover:bg-secondary focus-visible:ring-transparent" size="22" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => requestRemoveTeam(team.id)}>Удалить</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-6">Управление</Button>
          </DialogTrigger>
          <DialogContent className="w-[800px] max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Управление списками пользователей</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="account" className="w-full">
              <TabsList>
                <TabsTrigger value="current">Редактирование списка</TabsTrigger>
                <TabsTrigger value="search">Поиск новых пользователей</TabsTrigger>
              </TabsList>
              <TabsContent value="current">
                <div className="flex flex-col gap-y-2">
                  {/* <label className="text-sm">{t('label')}</label> */}
                  <div className="grid w-full grid-cols-[1fr_max-content_max-content] gap-x-2">
                    {/* <Input
                      name="email"
                      id="email"
                      className="dark:bg-neutral-900"
                      placeholder="name@company.com"
                      onChange={e => setSearch(e.target.value)}
                    />
                    <Button className="h-full" onClick={onSearch}>
                      <Search />
                    </Button> */}
                  </div>
                  <div className="flex w-full flex-col gap-y-2">
                    {/* <label className="text-sm">{users.length ? t('foundYourRequest') : t('noUsersFound')}</label> */}
                    {users.map(value => (
                      <SearchUserItem
                        key={value.id}
                        team={team}
                        user={value}
                        onAddUser={onAddUser}
                        onRemoveUser={onRemoveUser}
                        onUpdateUser={onUpdateUser}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="search">
                <div className="flex flex-col gap-y-2">
                  <label className="text-sm">{t('label')}</label>
                  <div className="grid w-full grid-cols-[1fr_max-content_max-content] gap-x-2">
                    <Input
                      name="email"
                      id="email"
                      className="dark:bg-neutral-900"
                      placeholder="name@company.com"
                      onChange={e => setSearch(e.target.value)}
                    />
                    <Button className="h-full" onClick={onSearch}>
                      <Search />
                    </Button>
                  </div>
                  <div className="flex w-full flex-col gap-y-2">
                    <label className="text-sm">
                      {searchResult?.length ? t('foundYourRequest') : t('noUsersFound')}
                    </label>
                    {searchResult?.map(value => (
                      <SearchUserItem
                        key={value.id}
                        team={team}
                        user={value}
                        onAddUser={onAddUser}
                        onRemoveUser={onRemoveUser}
                        onUpdateUser={onUpdateUser}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
