import { create } from "zustand"
import { persist } from "zustand/middleware"
import { fetchPost } from "@/shared/fetch"

interface LoginResponse {
  id: number,
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  gender: 'male' | 'female',
  image: string,
  accessToken: string,
  refreshToken: string
}

const initState = {
  id: null,
  username: null,
  email: null,
  firstName: null,
  lastName: null,
  gender: null,
  image: null,
  accessToken: null,
  refreshToken: null,
}

export const userStore = create<any>()(
  persist(
    (set) => ({
      ...initState,
      loginIn: async (username: string, password: string) => {
        try {
          const res = await fetchPost({ url: 'https://dummyjson.com/auth/login', data: { username, password, expiresInMins: 3 } })
          const info: LoginResponse = await res.json()
          set({
            id: info.id,
            username: info.username,
            email: info.email,
            firstName: info.firstName,
            lastName: info.lastName,
            gender: info.gender,
            image: info.image,
            accessToken: info.accessToken,
            refreshToken: info.refreshToken,
          })
          return info || {}
        } catch (error) {
          console.log(error)
          set(initState)
          return {}
        }
      },
      loginOut: () => {
        set(initState)
      }
    }),
    {
      name: 'userInfo',
    }
  )
)

