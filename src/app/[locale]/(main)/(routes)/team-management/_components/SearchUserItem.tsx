'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Button } from '@/components/ui/button'
import { type TeamManagementItem, type UserDB } from '@/stores'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

interface Props {
  team: TeamManagementItem
  user: UserDB
  onRemoveUser: (id: string) => void
  onAddUser: (id: string, role: string) => void
  onUpdateUser: (id: string, role: string) => void
}

export const SearchUserItem = ({ team, user, onAddUser, onRemoveUser, onUpdateUser }: Props) => {
  const t = useTranslations('EditorsModal')

  const [role, setRole] = useState<string>('observer')

  useEffect(() => {
    if (user?.id && team?.usersRoles?.hasOwnProperty(user?.id)) {
      setRole(team?.usersRoles[user.id])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team])

  const onAdd = () => {
    if (role) {
      onAddUser(user.id, role)
    }
  }

  const onSelected = (value: string) => {
    setRole(value)

    if (team?.users?.includes(user.id)) {
      onUpdateUser(user.id, value)
    }
  }

  return (
    <div className="flex w-full items-center justify-between">
      {user.email}
      <div className="flex gap-x-2">
        <Select value={role} onValueChange={value => onSelected(value)} required>
          <SelectTrigger className="h-6 w-[140px]">
            <SelectValue placeholder="Роль" />
          </SelectTrigger>
          <SelectContent className="z-[1000]">
            <SelectGroup>
              <SelectItem value="observer">Наблюдатель</SelectItem>
              <SelectItem value="editor">Редактор</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {team?.users?.includes(user.id) ? (
          <Button onClick={() => onRemoveUser(user.id)} className="h-6" variant="destructive">
            {t('remove')}
          </Button>
        ) : (
          <Button onClick={onAdd} className="h-6" variant="secondary">
            {t('add')}
          </Button>
        )}
      </div>
    </div>
  )
}
