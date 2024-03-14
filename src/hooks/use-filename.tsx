import { create } from 'zustand'

type FilenameStore = {
  saveFilename: (originalName: string, name: string) => void
}

export const useFilename = create<FilenameStore>(set => ({
  saveFilename: async (originalName: string, name: string) => {},
}))
