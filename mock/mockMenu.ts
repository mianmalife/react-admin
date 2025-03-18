import { http, HttpResponse } from 'msw'
import { menulist } from './menu'

export const handlerMenus = [
  http.get('/api/auth/menus', () => {
    return HttpResponse.json(menulist)
  })
]
