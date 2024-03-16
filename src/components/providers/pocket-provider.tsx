'use client'

import { usePocketbaseStore } from '@/stores/use-pocketbase.store'
import { useUserStore } from '@/stores/use-user.store'
import { useRouter } from 'next/navigation'
import PocketBase from 'pocketbase'
import { useEffect, useMemo } from 'react'
import { useInterval } from 'usehooks-ts'

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL

const TWO_MINUTE_IN_MS = 120000 as const

export const PocketProvider = () => {
  const pb = useMemo(() => new PocketBase(POCKETBASE_URL), [])
  const router = useRouter()

  const { checkAuth, refreshSession } = useUserStore()

  const token = useUserStore(state => state.token)

  const { setPocketbaseClient } = usePocketbaseStore()

  useEffect(() => {
    setPocketbaseClient(pb)

    if (!checkAuth()) router.push('/')

    console.log('check')
  }, [pb, setPocketbaseClient, checkAuth, router])

  useInterval(refreshSession, token ? TWO_MINUTE_IN_MS : null)

  return <></>
}
