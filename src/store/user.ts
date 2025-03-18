import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fakeAuthProvider } from '@/auth';

// 用户角色类型
export type UserRole = 'admin' | 'user' | 'guest';

// 用户权限类型
export type Permission = 'read' | 'write' | 'delete' | 'manage';

// 用户信息接口
export interface UserInfo {
  username: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  email?: string;
  lastLoginTime?: string;
}

// 登录响应接口
export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    userInfo: UserInfo;
  };
}

// 用户状态接口
export interface UserState {
  isAuthenticated: boolean;
  token: string | null;
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;

  // Actions
  setUserInfo: (info: UserInfo) => void;
  clearUserInfo: () => void;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// 初始状态
const initialState = {
  isAuthenticated: false,
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
          isAuthenticated: true,
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

          const res = await fakeAuthProvider.signin(username, password);

          if (res.isAuthenticated) {
            const token = fakeAuthProvider.getToken();

            if (!token) {
              throw new Error('获取token失败');
            }

            // 从localStorage获取用户信息，如果不存在则使用默认值
            const storedUserInfo = localStorage.getItem('userInfo');
            const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : {};

            const userData: UserInfo = {
              username,
              role: userInfo.role || 'user',
              permissions: userInfo.permissions || ['read'],
              lastLoginTime: new Date().toISOString()
            };

            // 设置用户信息和token
            setUserInfo(userData);
            set({ token });
            localStorage.setItem('token', token);
            return {
              success: true,
              message: '登录成功',
              data: {
                token,
                userInfo: userData
              }
            };
          }
          setError(res.message);
          return {
            success: false,
            message: res.message
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '登录失败，请稍后重试';
          setError(errorMessage);
          return {
            success: false,
            message: errorMessage
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

          await fakeAuthProvider.signout();
          clearUserInfo();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '登出失败，请稍后重试';
          setError(errorMessage);
          console.error('Logout failed:', error);
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
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