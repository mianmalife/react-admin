interface AuthProvider {
  isAuthenticated: boolean,
  username: null | string,
  signin(username: string): Promise<void>,
  signout(): Promise<void>
}

export const fakeAuthProvider: AuthProvider = {
  isAuthenticated: false,
  username: null,
  async signin(username: string) {
    await new Promise(resolve => setTimeout(resolve, 500))
    fakeAuthProvider.isAuthenticated = true;
    fakeAuthProvider.username = username;
  },
  async signout() {
    await new Promise(resolve => setTimeout(resolve, 500))
    fakeAuthProvider.isAuthenticated = false;
    fakeAuthProvider.username = ''
  }
}