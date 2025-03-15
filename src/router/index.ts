import { createBrowserRouter, LoaderFunctionArgs, redirect } from "react-router";
import Layout from "../layout";
import LoginPage from "../views/login";
import NotFoundPage from "../views/404";
import Analysis from "../views/dashboard/analysis";
import Monitor from "../views/dashboard/monitor";
import BasicForm from "../views/form/basic-form";
import Articles from "../views/list/search/articles";
import Projects from "../views/list/search/projects";

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    loader: protectedLoader,
    children: [
      {
        path: 'analysis',
        Component: Analysis
      },
    ]
  },
  {
    path: '/dashboard',
    Component: Layout,
    loader: protectedLoader,
    children: [
      {
        index: true,
        Component: Analysis
      },
      {
        path: 'analysis',
        Component: Analysis
      },
      {
        path: 'monitor',
        Component: Monitor
      }
    ]
  },
  {
    path: '/form',
    Component: Layout,
    loader: protectedLoader,
    children: [
      {
        index: true,
        Component: BasicForm
      },
      {
        path: 'basic-form',
        Component: BasicForm
      }
    ]
  },
  {
    path: '/list',
    Component: Layout,
    loader: protectedLoader,
    children: [
      {
        index: true,
        Component: Articles
      },
      {
        path: 'search',
        children: [
          {
            index: true,
            Component: Articles,
          },
          {
            path: 'articles',
            Component: Articles
          },
          {
            path: 'projects',
            Component: Projects
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    Component: LoginPage,
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
  const pathname = new URL(request.url).pathname
  params.set('from', pathname)
  if (localStorage.getItem('isAuthenticated') === 'false' || !localStorage.getItem('isAuthenticated')) {
    localStorage.clear()
    return redirect(`/login?` + params.toString())
  }
  console.log(request, 'request...', pathname)
  return null
}

export default router