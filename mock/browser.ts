import { setupWorker } from 'msw/browser'
import { handlers } from './auth'

export const worker = setupWorker(...handlers)

export default worker