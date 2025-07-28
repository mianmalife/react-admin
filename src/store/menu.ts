import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { menulist } from '~/mock/menu'
import { isArray } from '@/shared/util'

const menulistApi = () => new Promise(resolve => setTimeout(() => {
  return resolve(menulist)
}, 500))

interface MenuItem {
  key: string,
  label: string,
  children: MenuItem[] | undefined
}
function handlerMenuList(data: MenuItem[]): MenuItem[] {
  return data.map(item => {
    const _run = (prefix: string, value: MenuItem[] | undefined): MenuItem[] | undefined => {
      if (isArray(value) && value.length > 0) {
        return value.map(v => {
          return {
            ...v,
            key: `${prefix}/${v.key}`,
            children: isArray(v.children) && v.children.length > 0 ? _run(`${prefix}/${v.key}`, v.children) : v.children
          }
        })
      }
      return value
    }
    const prefix = item.key
    return {
      ...item,
      children: _run(prefix, item.children)
    }
  })
}

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
        const revertData = handlerMenuList(res as MenuItem[])
        set({ menuList: revertData })
        return revertData
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

