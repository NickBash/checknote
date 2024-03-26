import toast from 'react-hot-toast'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { usePocketbaseStore } from './use-pocketbase.store'
import { useUserStore } from './use-user.store'

export type DocumentCopy = {
  collectionId: string
  collectionName: string
  content: null | string
  created: string
  icon: string
  id: string
  isArchived: boolean
  isPublished: boolean
  parentDocument: string
  title: string
  updated: string
  userId: string
  coverImage: string
}

type DocumentsStore = {
  isLoading: boolean
  isError: boolean
  error: any
  listDocuments: DocumentCopy[]
  addDocument: (value: DocumentCopy) => void
  updateDocument: (value: DocumentCopy) => void
  deleteDocument: (id: string) => void
  requestGetDocuments: () => Promise<void>
  requestСreateDocument: (data?: DocumentTemplate) => Promise<unknown>
  requestUpdateDocument: (recordId: string, data: Partial<DocumentCopy>) => Promise<unknown>
  requestDeleteDocument: (recordId: string) => Promise<unknown>
}

type DocumentTemplate = Omit<DocumentCopy, 'collectionId' | 'collectionName' | 'id' | 'updated' | 'created'>

const documentTemplate: DocumentTemplate = {
  content: null,
  icon: '',
  isArchived: false,
  isPublished: false,
  parentDocument: '',
  title: 'Untitled',
  userId: '',
  coverImage: '',
}

export const useDocuments = create<DocumentsStore>()(
  devtools(
    immer((set, get) => ({
      isLoading: false,
      listDocuments: [],
      isError: false,
      error: null,
      addDocument: value =>
        set(state => {
          state.listDocuments.push(value)
        }),
      updateDocument: value =>
        set(state => {
          const index = state.listDocuments.findIndex(doc => doc.id === value.id)

          if (index > -1) {
            state.listDocuments[index] = value
          }
        }),
      deleteDocument: id =>
        set(state => {
          state.listDocuments = state.listDocuments.filter(doc => doc.id !== id)
        }),
      requestGetDocuments: async () => {
        const pb = usePocketbaseStore.getState().pocketbaseClient
        const user = useUserStore.getState().user

        if (pb && user) {
          set({ isLoading: true })

          try {
            const records = await pb.collection('documents').getFullList({
              filter: `userId = "${user.id}"`,
            })

            set({ listDocuments: records as DocumentCopy[], isLoading: false })
          } catch (e) {
            set({ isError: true, error: e, isLoading: false })
          }
        }
      },
      requestСreateDocument: async (data: DocumentTemplate = documentTemplate) => {
        const pb = usePocketbaseStore.getState().pocketbaseClient
        const user = useUserStore.getState().user

        if (pb && user) {
          data.userId = user.id

          try {
            await pb.collection('documents').create(data)

            toast.success('Документ создан')
          } catch (e) {
            console.error(e)
            toast.error('Не получилось содать документ')
          }
        }
      },
      requestUpdateDocument: async (recordId, data) => {
        const pb = usePocketbaseStore.getState().pocketbaseClient
        const user = useUserStore.getState().user

        if (user) {
          data.userId = user.id

          try {
            await pb?.collection('documents').update(recordId, data)

            toast.success('Документ обновлен')
          } catch (e) {
            console.error(e)
            toast.error('Не получилось обновить докукумент')
          }
        }
      },
      requestDeleteDocument: async (recordId: string) => {
        const pb = usePocketbaseStore.getState().pocketbaseClient
        const user = useUserStore.getState().user

        if (pb && user) {
          try {
            await pb.collection('documents').delete(recordId)

            toast.success('Документ удален')
          } catch (e) {
            console.error(e)
            toast.error('Не получилось удалить докукумент')
          }
        }
      },
    })),
  ),
)
