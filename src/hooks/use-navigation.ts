// import PocketBase from 'pocketbase'
// import { create } from 'zustand'

// type NavigationStore = {
//   isLoading: boolean
//   isError: boolean
//   error: any
//   documents: Document[] | null
//   getDocuments: (pb: any, user: any) => Promise<void>
// }

// export type NavigaionEl = {
//   collectionId: string
//   collectionName: string
//   content: null | string
//   created: string
//   icon: string
//   id: string
//   isArchived: boolean
//   isPublished: boolean
//   parentDocument: string
//   title: string
//   updated: string
//   userId: string
//   coverImage: string
// }

// type DocumentTemplate = Omit<Document, 'collectionId' | 'collectionName' | 'id' | 'updated' | 'created'>

// const documentTemplate: DocumentTemplate = {
//   content: null,
//   icon: '',
//   isArchived: false,
//   isPublished: false,
//   parentDocument: '',
//   title: 'Untitled',
//   userId: '',
//   coverImage: '',
// }

// export const useDocuments = create<DocumentsStore>((set, get) => ({
//   isLoading: false,
//   documents: null,
//   // onOpen: () => set({ isOpen: true }),
//   // onClose: () => set({ isOpen: false }),
//   // toggle: () => set({ isOpen: !get().isOpen }),
//   isError: false,
//   error: null,
//   getDocuments: async (pb: PocketBase, user: Record<string, any>) => {
//     set({ isLoading: true })

//     try {
//       const records = await pb.collection('documents').getFullList({
//         filter: `userId="${user.id}"`,
//       })
//       console.log(user)
//       console.log(records)
//       set({ documents: records as Document[], isLoading: false })
//     } catch (e) {
//       set({ isError: true, error: e, isLoading: false })
//     }
//   },
//   createDocuments: async (data: DocumentTemplate = documentTemplate, pb: PocketBase, user: Record<string, any>) => {
//     data.userId = user.id

//     try {
//       return await pb.collection('documents').create(data)
//     } catch (e) {
//       return e
//     }
//   },
// }))
