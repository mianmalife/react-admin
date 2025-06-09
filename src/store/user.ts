import { fetchGet, fetchPost } from '@/shared/fetch';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 用户角色类型
export type UserRole = 'admin' | 'user' | 'guest';

// 用户权限类型
export type Permission = [];

// 用户信息接口
export interface UserInfo {
  userName: string;
  role: UserRole;
  permissions: Permission[];
  loginTime?: string;
}

// 登录响应接口
export interface LoginResponse {
  code: number;
  data?: {
    access_token: string;
    loginTime: number;
  };
  msg: string
}

// 用户状态接口
export interface UserState {
  token: string | null;
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;

  // Actions
  setUserInfo: (info: UserInfo | null) => void;
  clearUserInfo: () => void;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 初始状态
const initialState = {
  token: null,
  userInfo: null,
  loading: false,
  error: null
};

// 存储键名
const STORAGE_KEY = 'user-storage';

// 清理存储
const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserInfo: (info) => {
        set({
          userInfo: info
        });
        // 同步存储用户信息
        localStorage.setItem('userInfo', JSON.stringify(info));
      },

      clearUserInfo: () => {
        set(initialState);
        clearStorage();
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      login: async (username: string, password: string) => {
        const { setLoading, setError, setUserInfo } = get();

        try {
          setLoading(true);
          setError(null);
          const res = await fetchPost({ url: '/api/auth/login', data: { username, password } })
          const loginRes = await res.json()
          if (loginRes.code === 200) {
            set({ token: loginRes.data.access_token })
            localStorage.setItem('token', loginRes.data.access_token)
            const usrRes = await fetchGet({ url: '/api/system/user/getInfo' })
            const usrData = await usrRes.json()
            if (usrData.code === 200) {
              const { role, permissions, loginTime } = usrData.data
              const { userName } = usrData.data.user
              setUserInfo({ userName, role, permissions, loginTime })
            } else {
              setUserInfo(null)
            }
          } else {
            setError(loginRes.msg)
          }
          return loginRes
        } catch (error) {
          console.log(error)
          setError('登录失败，请稍后重试');
          return {
            code: 400,
            data: {
              access_token: '',
              loginTime: 0,
            },
            msg: '登录失败，请稍后重试'
          };
        } finally {
          setLoading(false);
        }
      },

      logout: async () => {
        const { setLoading, setError, clearUserInfo } = get();
        try {
          setLoading(true);
          setError(null);
          const res = await fetchPost({ url: '/api/auth/logout' })
          const data = await res.json()
          if (data.code === 200) {
            clearUserInfo();
          }
        } catch (error) {
          setError('登出失败，请稍后重试');
          console.error('Logout failed:', error);
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo
      }),
      onRehydrateStorage: () => (state) => {
        // 检查存储的token是否有效
        const token = localStorage.getItem('token');
        if (!token) {
          clearStorage();
          return initialState;
        }
        return state;
      }
    }
  )
); 