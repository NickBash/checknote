import PocketBase from 'pocketbase'
import { create } from 'zustand'

type PocketbaseStore = {
  pocketbaseClient: PocketBase | undefined
  setPocketbaseClient: (pocketbase: PocketBase) => void
}

export const usePocketbaseStore = create<PocketbaseStore>(set => ({
  pocketbaseClient: undefined,
  setPocketbaseClient: pocketbase => set({ pocketbaseClient: pocketbase }),
}))
