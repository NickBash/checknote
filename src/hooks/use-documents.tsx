import PocketBase from 'pocketbase'
import toast from 'react-hot-toast'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type DocumentsStore = {
  isLoading: boolean
  isError: boolean
  error: any
  documents: Document[]
  getDocuments: (pb: any, user: any) => Promise<void>
  addDocument: (value: Document) => void
  updateDocument: (value: Document) => void
  deleteDocumentState: (value: Document) => void
  createDocuments: (pb: PocketBase, user: Record<string, any>, data?: DocumentTemplate) => Promise<unknown>
  updateDocuments: (
    pb: PocketBase,
    user: Record<string, any> | null,
    recordId: string,
    data: Partial<Document>,
  ) => Promise<unknown>
  deleteDocument: (pb: PocketBase, user: Record<string, any> | null, recordId: string) => Promise<unknown>
}

export type Document = {
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

type DocumentTemplate = Omit<Document, 'collectionId' | 'collectionName' | 'id' | 'updated' | 'created'>

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
    immer(set => ({
      isLoading: false,
      documents: [],
      isError: false,
      error: null,
      addDocument: (value: Document) =>
        set(state => {
          state.documents.push(value)
        }),
      updateDocument: (value: Document) =>
        set(state => {
          const index = state.documents.findIndex((doc: Document) => doc.id === value.id)

          if (index > -1) {
            state.documents[index] = value
          }
        }),
      deleteDocumentState: (value: Document) =>
        set(state => {
          state.documents = state.documents.filter((doc: Document) => doc.id !== value.id)
        }),
      getDocuments: async (pb: PocketBase, user: Record<string, any>) => {
        set({ isLoading: true })

        try {
          const records = await pb.collection('documents').getFullList({
            filter: `userId = "${user.id}"`,
          })

          set({ documents: records as Document[], isLoading: false })
        } catch (e) {
          set({ isError: true, error: e, isLoading: false })
        }
      },
      createDocuments: async (pb: PocketBase, user: Record<string, any>, data: DocumentTemplate = documentTemplate) => {
        data.userId = user.id

        try {
          await pb.collection('documents').create(data)

          toast.success('Документ создан')
        } catch (e) {
          console.error(e)
          toast.error('Не получилось содать документ')
        }
      },
      updateDocuments: async (
        pb: PocketBase,
        user: Record<string, any> | null,
        recordId: string,
        data: Partial<Document>,
      ) => {
        if (user) {
          data.userId = user.id

          try {
            await pb.collection('documents').update(recordId, data)

            toast.success('Документ обновлен')
          } catch (e) {
            console.error(e)
            toast.error('Не получилось обновить докукумент')
          }
        }
      },
      deleteDocument: async (pb: PocketBase, user: Record<string, any> | null, recordId: string) => {
        if (user) {
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
