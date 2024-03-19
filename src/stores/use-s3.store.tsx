import { create } from 'zustand'

type S3Store = {
  url: string | null
  setUrl: (url: string | null) => void
  getUrl: () => Promise<void>
  uploadFile: (file: File) => Promise<any>
  removeFile: (filename: string) => Promise<any>
}

export const useS3 = create<S3Store>(set => ({
  url: null,
  setUrl: url => set({ url }),
  getUrl: async () => {
    try {
      const response = await fetch(`/api/s3/get`, { method: 'POST' })
      const res = await response.json()

      if (res?.url) {
        set({ url: res.url })
      }
    } catch (e) {
      console.error(e)
    }
  },
  uploadFile: async file => {
    const body = new FormData()
    body.append('file', file, file.name)

    try {
      const response = await fetch('/api/s3', { method: 'POST', body })
      return await response.json()
    } catch (e) {
      return e
    }
  },
  removeFile: async filename => {
    const body = new FormData()
    body.append('filename', filename)

    try {
      const response = await fetch('/api/s3', { method: 'DELETE', body })
      return await response.json()
    } catch (e) {
      return e
    }
  },
}))
