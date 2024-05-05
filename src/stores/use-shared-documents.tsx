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
  getDocument: (recordId: string) => DocumentCopy | undefined
  requestGetDocuments: () => Promise<unknown>
  requestСreateDocument: (data?: Partial<DocumentTemplate>) => Promise<unknown>
  addDocument: (value: DocumentCopy) => void
  updateDocument: (value: DocumentCopy) => void
  deleteDocument: (id: string) => void
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
              filter: `editors ~ "${user.id}" || teams.users ~ "${user.id}"`,
              expand: 'editors,teams,teams.users',
            })

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
      addDocument: value =>
        set(state => {
          state.listDocuments.push(value)
        }),
      getDocument: recordId => get().listDocuments.find(doc => doc.id === recordId),
      updateDocument: value =>
        set(state => {
          const index = state.listDocuments.findIndex(doc => doc.id === value.id)

          if (index > -1) {
            state.listDocuments[index] = value
          } else {
            state.listDocuments.push(value)
          }
        }),
      deleteDocument: id =>
        set(state => {
          state.listDocuments = state.listDocuments.filter(doc => doc.id !== id)
        }),
    })),
  ),
)
