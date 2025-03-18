import 'virtual:uno.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19'
import App from './App.tsx'

async function enableMocks() {
  if(process.env.NODE_ENV !== 'development') {
    return
  }
  const { worker } = await import('../mock/browser')
  return worker.start()
}

enableMocks().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
