import { lazy } from "react";
import { createBrowserRouter, redirect, LoaderFunctionArgs } from "react-router";

const hasTokenLoader = ({ request }: LoaderFunctionArgs) => {
  const user = JSON.parse(localStorage.getItem('userInfo') || "{}")
  if (!user.state?.accessToken) {
    const params = new URLSearchParams()
    const pathname = new URL(request.url).pathname
    params.set('from', pathname)
    return redirect(`/login?${params.toString()}`);
  }
  return null;
}

function loginLoader() {
  const user = JSON.parse(localStorage.getItem('userInfo') || "{}")
  if (user.state?.accessToken) {
    return redirect('/');
  }
  return null;
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: lazy(() => import('@/layout')),
    loader: hasTokenLoader,
    children: [
      {
        index: true,
        loader: () => redirect('/dashboard/analysis')
      },
      {
        path: 'analysis',
        Component: lazy(() => import('@/views/dashboard/analysis'))
      },
    ]
  },
  {
    path: '/dashboard',
    Component: lazy(() => import('@/layout')),
    loader: hasTokenLoader,
    children: [
      {
        index: true,
        loader: () => redirect('/dashboard/analysis')
      },
      {
        path: 'analysis',
        Component: lazy(() => import('@/views/dashboard/analysis'))
      },
      {
        path: 'monitor',
        Component: lazy(() => import('@/views/dashboard/monitor'))
      }
    ]
  },
  {
    path: '/form',
    Component: lazy(() => import('@/layout')),
    loader: hasTokenLoader,
    children: [
      {
        index: true,
        loader: () => redirect('/form/basic-form')
      },
      {
        path: 'basic-form',
        Component: lazy(() => import('@/views/form/basic-form'))
      }
    ]
  },
  {
    path: '/list',
    Component: lazy(() => import('@/layout')),
    loader: hasTokenLoader,
    children: [
      {
        index: true,
        loader: () => redirect('/list/search/articles')
      },
      {
        path: 'search',
        children: [
          {
            index: true,
            loader: () => redirect('/list/search/articles')
          },
          {
            path: 'articles',
            Component: lazy(() => import('@/views/list/search/articles'))
          },
          {
            path: 'projects',
            Component: lazy(() => import('@/views/list/search/projects'))
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    Component: lazy(() => import('@/views/login')),
    loader: loginLoader,
  },
  {
    path: '*',
    Component: lazy(() => import('@/views/404'))
  }
])

export default router