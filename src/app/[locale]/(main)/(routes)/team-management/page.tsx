'use client'

import { useTeamManagementStore } from '@/stores'
import { PlusCircle } from 'lucide-react'
import { useEffect } from 'react'
import { TeamItem } from './_components/TeamItem'

export default function TeamManagment() {
  const requestGetTeams = useTeamManagementStore(state => state.requestGetTeams)
  const requestAddTeam = useTeamManagementStore(state => state.requestAddTeam)

  const teams = useTeamManagementStore(state => state.teams)

  useEffect(() => {
    requestGetTeams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addTeam = () => {
    requestAddTeam()
  }

  return (
    <div className="flex h-full justify-center">
      <div className="w-[90% flex flex-col gap-y-4 py-20 sm:w-full md:w-[90%]">
        <div className="mb-8">
          <h2 className="text-4xl font-semibold">Управление командами</h2>
        </div>
        {teams?.map((team: any) => <TeamItem key={team.id} team={team} />)}
        <div
          onClick={addTeam}
          className="flex cursor-pointer select-none items-center gap-x-4 rounded-sm bg-secondary px-4 py-2"
        >
          Добавить команду <PlusCircle size={18} />
        </div>
      </div>
    </div>
  )
}
