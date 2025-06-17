import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { menulist } from '~/mock/menu'

const menulistApi = () => new Promise(resolve => setTimeout(() => {
  return resolve(menulist)
}, 500))

const initialState = {
  menuList: [],
  selectedKeys: [],
  openKeys: [],
}

export const menuStore = create<any>()(
  persist(
    (set) => ({
      ...initialState,
      getMenuList: async () => {
        const res = await menulistApi()
        set({ menuList: res })
        return res
      },
      setSelectedKeys: (selectedKeys: Array<string>) => {
        set({ selectedKeys })
      },
      setOpenKeys: (openKeys: Array<string>) => {
        set({ openKeys })
      },
      clear: () => {
        set(initialState)
      }
    }),
    {
      name: 'menuData',
    })
)

