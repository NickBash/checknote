import { create } from 'zustand'

type NavigationStore = {
  isResetting: boolean
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
  setIsResetting: (value: boolean) => void
  changeCollapse: {}
  onChangeCollapse: () => void
}

export const useNavigationStore = create<NavigationStore>(set => ({
  isResetting: false,
  isCollapsed: false,
  changeCollapse: {},
  setIsCollapsed: value => {
    set({ isCollapsed: value })
  },
  setIsResetting: value => {
    set({ isResetting: value })
  },
  onChangeCollapse: () => {
    set({ changeCollapse: {} })
  },
}))
