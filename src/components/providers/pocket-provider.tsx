'use client'

import { jwtDecode } from 'jwt-decode'
import ms from 'ms'
import PocketBase, { type RecordAuthResponse, type RecordModel } from 'pocketbase'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useInterval } from 'usehooks-ts'

const BASE_URL = 'http://127.0.0.1:8090'
const fiveMinutesInMs = ms('5 minutes')
const twoMinutesInMs = ms('2 minutes')

const PocketContext = createContext({})

export const PocketProvider = ({ children }: { children: React.ReactNode }) => {
  const pb = useMemo(() => new PocketBase(BASE_URL), [])

  const [token, setToken] = useState(pb.authStore.token)
  const [user, setUser] = useState(pb.authStore.model)

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setToken(token)
      setUser(model)
    })
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    return await pb.collection('users').create({ email, password, passwordConfirm: password })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    return await pb.collection('users').authWithPassword(email, password)
  }, [])

  const logout = useCallback(() => {
    pb.authStore.clear()
  }, [])

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return
    const decoded: any = jwtDecode(token)
    const tokenExpiration = decoded.exp
    const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection('users').authRefresh()
    }
  }, [token])

  useInterval(refreshSession, token ? twoMinutesInMs : null)

  return (
    <PocketContext.Provider value={{ register, login, logout, user, token, pb }}>{children}</PocketContext.Provider>
  )
}

type PocketContextType = {
  register: (email: string, password: string) => Promise<RecordModel>
  login: (email: string, password: string) => Promise<RecordAuthResponse<RecordModel>>
  logout: () => void
  user: {
    [key: string]: any
  } | null
  token: string
  pb: PocketBase
}

export const usePocket = () => useContext(PocketContext) as PocketContextType
