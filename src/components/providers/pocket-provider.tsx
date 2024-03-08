'use client'

import { jwtDecode } from 'jwt-decode'
import ms from 'ms'
import { useRouter } from 'next/navigation'
import PocketBase, { type AuthModel, type RecordAuthResponse, type RecordModel } from 'pocketbase'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useInterval } from 'usehooks-ts'

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
const fiveMinutesInMs = ms('5 minutes')
const twoMinutesInMs = ms('2 minutes')

const PocketContext = createContext({})

type ResLogin = {
  record: Record<string, any>
  token: string
}

export const PocketProvider = ({ children }: { children: React.ReactNode }) => {
  const pb = useMemo(() => new PocketBase(POCKETBASE_URL), [])
  const router = useRouter()

  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthModel | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    if (pb.authStore.isValid) {
      try {
        const res: ResLogin = await pb.collection('users').authRefresh()

        setUser(res.record)
        setToken(res.token)
        setIsLoadingUser(false)
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.name.includes('401')) {
            router.push('/')
          }
        }
      }
    } else if (window.navigator.onLine) {
      console.warn('AUTHSTORE INVALID, SHOW LOGIN UI')
      router.push('/')
    }
  }, [pb, router])

  const register = useCallback(async (email: string, password: string) => {
    return await pb.collection('users').create({ email, password, passwordConfirm: password })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res: ResLogin = await pb.collection('users').authWithPassword(email, password)

      setUser(res.record)
      setToken(res.token)
    } catch (error: unknown) {
      console.warn(error)
    }
  }, [])

  const logout = useCallback(() => {
    pb.authStore.clear()
  }, [])

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return
    const decoded: any = jwtDecode(token as string)
    const tokenExpiration = decoded.exp
    const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection('users').authRefresh()
    }
  }, [token])

  useInterval(refreshSession, token ? twoMinutesInMs : null)

  return (
    <PocketContext.Provider value={{ register, login, logout, user, token, pb, isLoadingUser }}>
      {children}
    </PocketContext.Provider>
  )
}

type PocketContextType = {
  register: (email: string, password: string) => Promise<RecordModel>
  login: (email: string, password: string) => Promise<RecordAuthResponse<RecordModel>>
  logout: () => void
  user: Record<string, any> | null
  token: string
  pb: PocketBase
  isLoadingUser: boolean
}

export const usePocket = () => useContext(PocketContext) as PocketContextType
