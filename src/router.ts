import { createBrowserRouter, LoaderFunctionArgs, redirect } from "react-router";
import Layout from "./layout";
import loginPage from "./views/login";
import { fakeAuthProvider } from "./auth";
import NotFoundPage from "./views/404";
import Example from "./views/example";

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    loader: protectedLoader,
    children: [
      {
        path: 'test',
        Component: Example
      },
    ]
  },
  {
    path: '/login',
    Component: loginPage
  },
  {
    path: '*',
    Component: NotFoundPage
  }
])

function protectedLoader({ request }: LoaderFunctionArgs) {
  const params = new URLSearchParams()
  params.set('from', new URL(request.url).pathname)
  if (!fakeAuthProvider.isAuthenticated) {
    return redirect(`/login?` + params.toString())
  }
  return null
}

export default router