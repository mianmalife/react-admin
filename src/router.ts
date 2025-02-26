import { createBrowserRouter, LoaderFunctionArgs, redirect } from "react-router";
import layout from "./layout";
import loginPage from "./views/login";
import NotFoundPage from "./views/404";
import Example from "./views/example";

const router = createBrowserRouter([
  {
    path: '/',
    Component: layout,
    loader: protectedLoader,
    children: [
      {
        index: true,
        Component: Example
      },
    ]
  },
  {
    path: '/login',
    Component: loginPage,
    loader: loginLoader,
  },
  {
    path: '*',
    Component: NotFoundPage
  }
])

function loginLoader() {
  if (localStorage.getItem('isAuthenticated') === 'true') {
    return redirect('/')
  }
  return null
}

function protectedLoader({ request }: LoaderFunctionArgs) {
  const params = new URLSearchParams()
  params.set('from', new URL(request.url).pathname)
  if (localStorage.getItem('isAuthenticated') === 'false' || !localStorage.getItem('isAuthenticated')) {
    return redirect(`/login?` + params.toString())
  }
  return null
}

export default router