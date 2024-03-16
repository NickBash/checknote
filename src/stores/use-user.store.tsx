import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'
import { usePocketbaseStore } from './use-pocketbase.store'

const FIVE_MINUTE_IN_MS = 300000 as const

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
  register: (email: string, password: string) => void
  login: (email: string, password: string) => void
  logout: () => void
  refreshSession: () => void
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
  register: async (email, password) => {
    const pb = usePocketbaseStore.getState().pocketbaseClient

    try {
      return await pb?.collection('users').create({ email, password, passwordConfirm: password })
    } catch (e) {
      console.log(e)
      return false
    }
  },
  login: async (email: string, password: string) => {
    const pb = usePocketbaseStore.getState().pocketbaseClient

    try {
      const res: ResLogin | undefined = await pb?.collection('users').authWithPassword(email, password)

      if (res) {
        set({
          user: res.record,
          token: res.token,
          isLoadingUser: false,
        })
      }
    } catch (error: unknown) {
      get().clearUser()

      console.error(error)
    }
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
}))
