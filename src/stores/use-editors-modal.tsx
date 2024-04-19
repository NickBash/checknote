import { create } from 'zustand'
import type { DocumentCopy } from './use-documents.store'

type EditorsModalStore = {
  isOpen: boolean
  initialDocument: DocumentCopy | null
  onOpen: (documentCopy: DocumentCopy) => void
  onClose: () => void
}

export const useEditorsModal = create<EditorsModalStore>(set => ({
  isOpen: false,
  initialDocument: null,
  onOpen: documentCopy => set({ isOpen: true, initialDocument: documentCopy }),
  onClose: () => set({ isOpen: false, initialDocument: null }),
}))
