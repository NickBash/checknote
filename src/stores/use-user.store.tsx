import { jwtDecode } from 'jwt-decode'
import type { RecordAuthResponse, RecordModel } from 'pocketbase'
import { create } from 'zustand'
import { usePocketbaseStore } from './use-pocketbase.store'

const FIVE_MINUTE_IN_MS = 300000 as const

export interface UserDB {
  email: string
  id: string
  name: string
  updated: string
  username: string
  avatar: string
  created: string
  emailVisibility: boolean
  verified: boolean
}

type ResLogin = {
  record: Record<string, any>
  token: string
}

type UserStore = {
  user: Record<string, any> | null
  token: string | null
  isLoadingUser: boolean
  clearUser: () => void
  setUser: (user: Record<string, any> | null) => void
  setToken: (token: string | null) => void
  setIsLoadingUser: (value: boolean) => void
  checkAuth: () => Promise<boolean | undefined> | boolean
  checkYandex: () => Promise<void | RecordAuthResponse<RecordModel>> | undefined
  register: (email: string, password: string) => Promise<any> | undefined
  login: (email: string, password: string) => Promise<any> | undefined
  logout: () => void
  refreshSession: () => void
  findUser: (value: string) => any
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  token: null,
  isLoadingUser: true,
  clearUser: () => set({ user: null, token: null, isLoadingUser: false }),
  setUser: user => set({ user }),
  setToken: token => set({ token }),
  setIsLoadingUser: value => set({ isLoadingUser: value }),
  checkAuth: async () => {
    const pb = usePocketbaseStore.getState().pocketbaseClient

    if (pb?.authStore.isValid) {
      try {
        const res: ResLogin = await pb.collection('users').authRefresh()

        set({
          user: res.record,
          token: res.token,
          isLoadingUser: false,
        })

        return true
      } catch (error: unknown) {
        get().clearUser()

        return false
      }
    } else if (window.navigator.onLine) {
      console.error('AUTHSTORE INVALID, SHOW LOGIN UI')

      get().clearUser()

      return false
    }
  },
  register: (email, password) => {
    const pb = usePocketbaseStore.getState().pocketbaseClient

    return pb?.collection('users').create({ email, password, passwordConfirm: password, emailVisibility: true })
  },
  login: async (email: string, password: string) => {
    const pb = usePocketbaseStore.getState().pocketbaseClient

    return pb
      ?.collection('users')
      .authWithPassword(email, password)
      .then(res => {
        set({
          user: res.record,
          token: res.token,
          isLoadingUser: false,
        })
      })
    // .catch(() => {
    //   get().clearUser()
    // })
  },
  logout: () => {
    const pb = usePocketbaseStore.getState().pocketbaseClient

    pb?.authStore.clear()

    get().clearUser()
  },
  refreshSession: async () => {
    const pb = usePocketbaseStore.getState().pocketbaseClient

    if (!pb?.authStore.isValid) return
    const decoded: any = jwtDecode(get().token as string)
    const tokenExpiration = decoded.exp
    const expirationWithBuffer = (decoded.exp + FIVE_MINUTE_IN_MS) / 1000
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection('users').authRefresh()
    }
  },
  findUser: async value => {
    const pb = usePocketbaseStore.getState().pocketbaseClient
    const user = get().user

    if (pb && user) {
      const records = await pb.collection('users').getFullList({ filter: `email ~ "${value}"` })

      return records
    } else {
      return null
    }
  },
  checkYandex: () => {
    const pb = usePocketbaseStore.getState().pocketbaseClient

    return pb
      ?.collection('users')
      .authWithOAuth2({ provider: 'yandex', createData: { emailVisibility: true } })
      .then(res => {
        if (res?.record) {
          set({ user: res.record, token: res.token })
        }
      })
  },
}))
