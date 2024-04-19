import { create } from 'zustand'

type CoverImageStore = {
  url?: string | null
  isOpen: boolean
  sharedMode: boolean
  onOpen: (sharedMode?: boolean) => void
  onClose: () => void
  onReplace: (url: string) => void
  setUrlImage: (url: string | null) => void
  requestGetImage: (fileName: string) => void
}

export const useCoverImage = create<CoverImageStore>(set => ({
  url: null,
  isOpen: false,
  sharedMode: false,
  onOpen: (sharedMode = false) => set({ isOpen: true, url: undefined, sharedMode }),
  onClose: () => set({ isOpen: false, url: undefined, sharedMode: false }),
  onReplace: (url: string) => set({ isOpen: true, url }),
  setUrlImage: (url: string | null) => set({ url }),
  requestGetImage: async (fileName: string) => {
    const body = new FormData()

    body.append('fileName', fileName)

    try {
      const response = await fetch(`/api/s3/get`, { method: 'POST', body })
      const result = await response.json()

      console.log(result.src)

      //set({ url: result?.src })
    } catch (e) {
      console.error(e)
    }
  },
}))
