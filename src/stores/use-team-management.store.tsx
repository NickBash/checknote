import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { usePocketbaseStore } from './use-pocketbase.store'
import { useUserStore, type UserDB } from './use-user.store'

export type TeamManagementItem = {
  id: string
  name: string
  owner: string
  updated: string
  users: any[]
  usersRoles: any
  expand: {
    users: UserDB[]
  }
}

type TeamManagementStore = {
  isLoading: boolean
  teams: TeamManagementItem[]
  isError: boolean
  requestGetTeams: () => Promise<void> | undefined
  requestAddTeam: () => Promise<void> | undefined
  requestRemoveTeam: (recotdId: string) => Promise<void> | undefined
  requestUpdateTeam: (item: Partial<TeamManagementItem>) => Promise<void> | undefined
}

export const useTeamManagementStore = create<TeamManagementStore>()(
  immer(set => ({
    isLoading: false,
    isError: false,
    teams: [],
    requestGetTeams: () => {
      const pb = usePocketbaseStore.getState().pocketbaseClient
      const user = useUserStore.getState().user

      if (pb && user) {
        set({ isLoading: true })

        return pb
          .collection('teams')
          .getFullList({
            filter: `owner ~ "${user.id}"`,
            expand: 'users',
          })
          .then((records: unknown) => {
            set({ teams: records as TeamManagementItem[], isLoading: false })
          })
          .catch(() => {
            set({ isError: true, isLoading: false })
          })
      }
    },
    requestAddTeam: () => {
      const pb = usePocketbaseStore.getState().pocketbaseClient
      const user = useUserStore.getState().user

      if (pb && user) {
        return pb
          .collection('teams')
          .create({ owner: user.id, name: 'Untitled' })
          .then((record: unknown) => {
            console.log(record)
            set(state => {
              state.teams.push(record as TeamManagementItem)
            })
          })
      }
    },
    requestRemoveTeam: recordId => {
      const pb = usePocketbaseStore.getState().pocketbaseClient
      const user = useUserStore.getState().user

      if (pb && user) {
        return pb
          .collection('teams')
          .delete(recordId)
          .then(record => {
            set(state => {
              state.teams = state.teams.filter(team => team.id !== recordId)
            })
          })
      }
    },
    requestUpdateTeam: item => {
      const pb = usePocketbaseStore.getState().pocketbaseClient
      const user = useUserStore.getState().user

      if (pb && user) {
        return pb
          .collection('teams')
          .update(item.id as string, item, { expand: 'users' })
          .then((record: unknown) => {
            set(state => {
              const index = state.teams.findIndex(team => team.id === item.id)
              state.teams[index] = record as TeamManagementItem
            })
          })
      }
    },
  })),
)
