interface AuthProvider {
  isAuthenticated: string,
  username: null | string,
  password: null | string,
  signin(username: string, password: string): Promise<{ isAuthenticated: boolean, message: string }>,
  signout(): Promise<boolean>
}

export const fakeAuthProvider: AuthProvider = {
  isAuthenticated: localStorage.getItem('isAuthenticated') ?? 'false',
  username: localStorage.getItem('username'),
  password: null,
  signin(username: string, password: string) {
    return new Promise(resolve => setTimeout(() => {
      // mock
      if (username === 'admin' && password === '123456') {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('username', username)
        resolve({
          isAuthenticated: true,
          message: '登录成功'
        })
      } else {
        localStorage.setItem('isAuthenticated', '')
        localStorage.setItem('username', '')
        resolve({
          isAuthenticated: false,
          message: '登录失败, 用户名或密码错误'
        })
      }
    }, 500))
  },
  signout() {
    return new Promise(resolve => setTimeout(() => {
      localStorage.setItem('isAuthenticated', '')
      localStorage.setItem('username', '')
      resolve(true)
    }, 500))
  }
}