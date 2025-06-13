import { http, HttpResponse } from 'msw'
import { menulist } from './menu'

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { username, password } = await request.json() as { username: string, password: string }
    if (username === 'admin' && btoa(password) === 'MTIzNDU2') {
      return HttpResponse.json({
        code: 200,
        data: {
          access_token: btoa(`${username}-${Date.now()}-${Math.random()}`),
          loginTime: Date.now()
        },
        msg: '登录成功'
      })
    } else {
      return HttpResponse.json({
        code: 400,
        data: {},
        msg: '登录失败，用户名或密码错误'
      })
    }
  }),
  http.get('/api/system/user/getInfo', () => {
    return HttpResponse.json({
      code: 200,
      data: {
        permissions: [],
        role: ['admin'],
        user: {
          userName: 'admin',
          loginTime: Date.now()
        }
      },
      msg: '操作成功'
    })
  }),
  http.post('/api/user/logout', () => {
    return HttpResponse.json({
      code: 200,
      msg: '操作成功'
    })
  }),
  http.get('/api/auth/menus', () => {
    return HttpResponse.json(menulist)
  })
]
