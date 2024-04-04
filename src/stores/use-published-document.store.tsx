import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { DocumentCopy } from '.'
import { usePocketbaseStore } from './use-pocketbase.store'

type PublishedDocumentStore = {
  isLoading: boolean
  isError: boolean
  error: any
  document: DocumentCopy | null
  requestGetOneDocument: (recordId: string) => Promise<void>
}

export const usePublishedDocument = create<PublishedDocumentStore>()(
  devtools(set => ({
    isLoading: false,
    document: null,
    isError: false,
    error: null,
    requestGetOneDocument: async recordId => {
      const pb = usePocketbaseStore.getState().pocketbaseClient

      if (pb) {
        set({ isLoading: true })

        try {
          const records = await pb.collection('documents').getOne(recordId)

          set({ document: records as DocumentCopy, isLoading: false })
        } catch (e) {
          set({ isError: true, error: e, isLoading: false })
        }
      }
    },
  })),
)
