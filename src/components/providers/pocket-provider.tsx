'use client'

import { useDocuments, type DocumentCopy } from '@/stores'
import { usePocketbaseStore } from '@/stores/use-pocketbase.store'
import { useSharedDocuments } from '@/stores/use-shared-documents'
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

  const checkAuth = useUserStore(state => state.checkAuth)
  const refreshSession = useUserStore(state => state.refreshSession)
  const user = useUserStore(state => state.user)

  const addDocument = useDocuments(state => state.addDocument)
  const updateDocument = useDocuments(state => state.updateDocument)
  const deleteDocument = useDocuments(state => state.deleteDocument)

  const addSharedDocument = useSharedDocuments(state => state.addDocument)
  const updateSharedDocument = useSharedDocuments(state => state.updateDocument)
  const deleteSharedDocument = useSharedDocuments(state => state.deleteDocument)

  const token = useUserStore(state => state.token)

  const { setPocketbaseClient } = usePocketbaseStore()

  useEffect(() => {
    setPocketbaseClient(pb)

    if (!checkAuth()) router.push('/')
  }, [pb, setPocketbaseClient, checkAuth, router])

  useEffect(() => {
    if (user && pb) {
      pb?.collection('documents').subscribe(
        '*',
        e => {
          if (e?.action === 'create') {
            addDocument(e?.record as DocumentCopy)
          }
          if (e?.action === 'update') {
            updateDocument(e?.record as DocumentCopy)
          }
          if (e?.action === 'delete') {
            deleteDocument((e?.record as DocumentCopy).id)
          }
        },
        { filter: `userId = "${user.id}"`, expand: 'editors,teams,teams.users' },
      )
    }

    if (user && pb) {
      pb?.collection('documents').subscribe(
        '*',
        e => {
          if (e?.action === 'create') {
            addSharedDocument(e?.record as DocumentCopy)
          }
          if (e?.action === 'update') {
            updateSharedDocument(e?.record as DocumentCopy)
          }
          if (e?.action === 'delete') {
            deleteSharedDocument((e?.record as DocumentCopy).id)
          }
        },
        { filter: `editors ~ "${user.id}" || teams.users ~ "${user.id}"`, expand: 'editors,teams,teams.users' },
      )
    }

    return () => {
      pb?.collection('documents').unsubscribe('*')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pb])

  useInterval(refreshSession, token ? TWO_MINUTE_IN_MS : null)

  return null
}
