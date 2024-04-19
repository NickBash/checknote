import toast from 'react-hot-toast'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { usePocketbaseStore } from './use-pocketbase.store'
import { useUserStore, type UserDB } from './use-user.store'

type Expand = {
  editors: UserDB[]
}

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
  contentId: string | null
  editors: string[] | null
  expand?: Expand
}

type DocumentsStore = {
  isLoading: boolean
  isError: boolean
  error: any
  listDocuments: DocumentCopy[]
  addDocument: (value: DocumentCopy) => void
  getDocument: (recordId: string) => DocumentCopy | undefined
  updateDocument: (value: DocumentCopy) => void
  deleteDocument: (id: string) => void
  requestGetDocuments: () => Promise<void>
  requestСreateDocument: (data?: Partial<DocumentTemplate>) => Promise<unknown>
  requestUpdateDocument: (recordId: string, data: Partial<DocumentCopy>, sharedMode?: boolean) => Promise<unknown>
  requestDeleteDocument: (recordId: string) => Promise<unknown>
  onArchiveDocuments: (recordId: string) => void
  onRestoreDocuments: (recordId: string) => void
  onRemoveDocuments: (recordId: string) => void
  requestUpdateEditors: (recordId: string, userId: string) => void
  requestRemoveEditor: (recordId: string, userId: string) => void
}

export type DocumentTemplate = Omit<DocumentCopy, 'collectionId' | 'collectionName' | 'id' | 'updated' | 'created'>

export const documentTemplate: DocumentTemplate = {
  content: null,
  icon: '',
  isArchived: false,
  isPublished: false,
  parentDocument: '',
  title: 'Untitled',
  userId: '',
  coverImage: '',
  contentId: null,
  editors: null,
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
      getDocument: recordId => get().listDocuments.find(doc => doc.id === recordId),
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
              expand: 'editors',
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
          const doc: DocumentTemplate = { ...documentTemplate, ...data, userId: user.id }

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
      requestUpdateDocument: async (recordId, data, sharredMode = false) => {
        const pb = usePocketbaseStore.getState().pocketbaseClient
        const user = useUserStore.getState().user

        if (user) {
          if (!sharredMode) {
            data.userId = user.id
          }

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
      onArchiveDocuments: recordId => {
        const currentDoc = get().getDocument(recordId)

        if (currentDoc) {
          const docs: DocumentCopy[] = [currentDoc]

          const recursionFindDocs = (parentIdDocument: string) => {
            const findChildrens = get().listDocuments.filter(doc => doc.parentDocument === parentIdDocument)

            if (findChildrens.length) {
              docs.push(...findChildrens)

              findChildrens.forEach(doc => {
                recursionFindDocs(doc.id)
              })
            }
          }

          recursionFindDocs(currentDoc.id)

          if (docs.length) {
            docs.forEach(doc => {
              get().requestUpdateDocument(doc.id, { isArchived: true, isPublished: false })
            })
          }
        }
      },
      onRestoreDocuments: recordId => {
        const currentDoc = get().getDocument(recordId)

        if (currentDoc) {
          const parentDoc = currentDoc.parentDocument ? get().getDocument(currentDoc.parentDocument) : null

          const docs: DocumentCopy[] = []

          const recursionFindDocs = (parentIdDocument: string) => {
            const findChildrens = get().listDocuments.filter(doc => doc.parentDocument === parentIdDocument)

            if (findChildrens.length) {
              docs.push(...findChildrens)

              findChildrens.forEach(doc => {
                recursionFindDocs(doc.id)
              })
            }
          }

          recursionFindDocs(currentDoc.id)

          if (!parentDoc || parentDoc.isArchived) {
            get().requestUpdateDocument(currentDoc.id, { isArchived: false, parentDocument: '' })
          } else {
            docs.unshift(currentDoc)
          }

          if (docs.length) {
            docs.forEach(doc => {
              get().requestUpdateDocument(doc.id, { isArchived: false })
            })
          }
        }
      },
      onRemoveDocuments: recordId => {
        const currentDoc = get().getDocument(recordId)

        if (currentDoc) {
          const docs: DocumentCopy[] = [currentDoc]

          const recursionFindDocs = (parentIdDocument: string) => {
            const findChildrens = get().listDocuments.filter(doc => doc.parentDocument === parentIdDocument)

            if (findChildrens.length) {
              docs.push(...findChildrens)

              findChildrens.forEach(doc => {
                recursionFindDocs(doc.id)
              })
            }
          }

          recursionFindDocs(currentDoc.id)

          if (docs.length) {
            docs.forEach(doc => {
              get().requestDeleteDocument(doc.id)
            })
          }
        }
      },
      requestUpdateEditors: async (recordId, userId) => {
        const documentCopy = get().getDocument(recordId)

        if (documentCopy) {
          return await get().requestUpdateDocument(recordId, {
            editors: Array.isArray(documentCopy.editors) ? [...documentCopy.editors, userId] : [userId],
          })
        }
      },
      requestRemoveEditor: async (recordId, userId) => {
        const documentCopy = get().getDocument(recordId)

        if (documentCopy) {
          return await get().requestUpdateDocument(recordId, {
            editors: documentCopy.editors?.filter(value => value !== userId),
          })
        }
      },
    })),
  ),
)
