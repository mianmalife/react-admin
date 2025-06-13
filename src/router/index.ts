import { lazy } from "react";
import { createBrowserRouter, LoaderFunctionArgs, redirect } from "react-router";

// 验证 token 是否有效
const validateToken = () => {
  if (!localStorage.getItem('token')) return false;
  try {
    // 这里可以添加 token 解析和验证逻辑
    // 例如检查 token 是否过期
    return true;
  } catch (error) {
    return false;
  }
};

function loginLoader() {
  if (validateToken()) {
    return redirect('/');
  }
  return null;
}

function protectedLoader({ request }: LoaderFunctionArgs) {
  const params = new URLSearchParams();
  const pathname = new URL(request.url).pathname;
  params.set('from', pathname);

  // 验证 token
  if (!validateToken()) {
    // 清除所有认证信息
    localStorage.clear();
    return redirect(`/login?${params.toString()}`);
  }

  return null;
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: lazy(() => import('@/layout')),
    loader: protectedLoader,
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
    loader: protectedLoader,
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
    loader: protectedLoader,
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
    loader: protectedLoader,
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