import 'normalize.css/normalize.css'
import './App.less'
import { RouterProvider } from 'react-router'
import router from './router';
import { useEffect } from 'react';
function App() {
  useEffect(() => {
    document.title = import.meta.env.VITE_TITLE
  }, [])
  return (
    <RouterProvider router={router} />
  )
}

export default App
