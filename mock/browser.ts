import { setupWorker } from 'msw/browser'
import { handlerMenus } from './mockMenu'

export const worker = setupWorker(...handlerMenus)

export default worker