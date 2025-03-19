import { createBrowserRouter, LoaderFunctionArgs, redirect } from "react-router";
import Layout from "../layout";
import LoginPage from "../views/login";
import NotFoundPage from "../views/404";
import Analysis from "../views/dashboard/analysis";
import Monitor from "../views/dashboard/monitor";
import BasicForm from "../views/form/basic-form";
import Articles from "../views/list/search/articles";
import Projects from "../views/list/search/projects";

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
    Component: Layout,
    loader: protectedLoader,
    children: [
      {
        index: true,
        loader: () => redirect('/dashboard/analysis')
      },
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
        loader: () => redirect('/dashboard/analysis')
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
        loader: () => redirect('/form/basic-form')
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

export default router