import { create } from 'zustand'
import { combine, persist } from 'zustand/middleware'


export const useSiderMenuStore = create(
  persist(combine({ menuData: [], selectedKeys: [], openKeys: [] }, set => ({
    setMenuData: (v: any) => set(_state => ({ menuData: v })),
    setSelectedKeys: (v: any) => set(_state => ({ selectedKeys: v })),
    setOpenKeys: (v: any) => set(_state => ({ openKeys: v }))
  })), { name: 'menuData' })
)