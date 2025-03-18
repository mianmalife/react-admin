import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MenuState {
  menuList: any[]
  selectedKeys: string[]
  openKeys: string[]
  setMenuList: (menuList: any[]) => void
  getMenuList: () => Promise<any>
  setSelectedKeys: (selectedKeys: string[]) => void
  setOpenKeys: (openKeys: string[]) => void
  clearMenu: () => void
}

const initialState = {
  menuList: [],
  selectedKeys: [],
  openKeys: [],
}

export const useSiderMenuStore = create<MenuState>()(
  persist((set, get) => ({
    ...initialState,
    setMenuList: (menuList) => {
      set({ menuList })
    },
    getMenuList: async () => {
      const res = await fetch('/api/auth/menus')
      const json = await res.json()
      set({ menuList: json })
      return json
    },
    setSelectedKeys: (selectedKeys) => {
      set({ selectedKeys })
    },
    setOpenKeys: (openKeys) => {
      set({ openKeys })
    },
    clearMenu: () => {
      set(initialState)
    }
  }),
  {
    name: 'menuData',
  })
)

