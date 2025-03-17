interface AuthProvider {
  isAuthenticated: boolean;
  username: string | null;
  signin: (username: string, password: string) => Promise<{ isAuthenticated: boolean; message: string }>;
  signout: () => Promise<boolean>;
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

// 模拟 token 生成
const generateToken = (username: string) => {
  return btoa(`${username}-${Date.now()}-${Math.random()}`);
};

export const fakeAuthProvider: AuthProvider = {
  isAuthenticated: false,
  username: null,

  getToken() {
    return localStorage.getItem('token');
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  removeToken() {
    localStorage.removeItem('token');
  },

  signin(username: string, password: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟后端验证
        if (username === 'admin' && btoa(password) === 'MTIzNDU2') {
          const token = generateToken(username);
          this.setToken(token);
          this.isAuthenticated = true;
          this.username = username;

          // 存储用户信息（实际项目中应该只存储必要信息）
          localStorage.setItem('username', username);
          localStorage.setItem('userInfo', JSON.stringify({
            username,
            role: 'admin',
            permissions: ['read', 'write']
          }));

          resolve({
            isAuthenticated: true,
            message: '登录成功'
          });
        } else {
          this.removeToken();
          this.isAuthenticated = false;
          this.username = null;
          localStorage.removeItem('username');
          localStorage.removeItem('userInfo');

          resolve({
            isAuthenticated: false,
            message: '用户名或密码错误'
          });
        }
      }, 500);
    });
  },

  signout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 清理所有认证相关信息
        this.removeToken();
        this.isAuthenticated = false;
        this.username = null;
        localStorage.removeItem('username');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('menuData');
        resolve(true);
      }, 500);
    });
  }
};