import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import toast from 'react-hot-toast'
import { documentTemplate, type DocumentCopy, type DocumentTemplate } from './use-documents.store'
import { usePocketbaseStore } from './use-pocketbase.store'
import { useUserStore } from './use-user.store'

type SharedDocumentsStore = {
  isLoading: boolean
  isError: boolean
  error: any
  listDocuments: DocumentCopy[]
  requestGetDocuments: () => Promise<unknown>
  requestСreateDocument: (data?: Partial<DocumentTemplate>) => Promise<unknown>
}

export const useSharedDocuments = create<SharedDocumentsStore>()(
  devtools(
    immer((set, get) => ({
      isLoading: false,
      listDocuments: [],
      isError: false,
      error: null,
      requestGetDocuments: async () => {
        const pb = usePocketbaseStore.getState().pocketbaseClient
        const user = useUserStore.getState().user

        if (pb && user) {
          set({ isLoading: true })

          try {
            const records = await pb.collection('documents').getFullList({
              filter: `editors ~ "${user.id}"`,
            })

            console.log(records)

            set({ listDocuments: records as DocumentCopy[], isLoading: false })
          } catch (e) {
            set({ isError: true, error: e, isLoading: false })
          }
        }
      },
      requestСreateDocument: async data => {
        const pb = usePocketbaseStore.getState().pocketbaseClient
        const user = useUserStore.getState().user

        if (pb && user) {
          const doc: DocumentTemplate = { ...documentTemplate, ...data }

          try {
            const { id } = await pb.collection('documentsContent').create({})
            await pb.collection('documents').create({ ...doc, contentId: id })

            toast.success('Документ создан')
          } catch (e) {
            console.error(e)
            toast.error('Не получилось содать документ')
          }
        }
      },
    })),
  ),
)
