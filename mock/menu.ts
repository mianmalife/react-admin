export const menulist = [
  {
    key: '1',
    label: 'Dashboard',
    path: '/dashboard',
    component: 'Layout',
    children: [
      {
        key: '1-1',
        label: '分析页',
        path: '/dashboard/analysis',
        component: '/dashboard/analysis/index',
        children: undefined
      },
      {
        key: '1-2',
        label: '监控页',
        path: '/dashboard/monitor',
        component: '/dashboard/monitor/index',
        children: undefined
      },
    ],
  },
  {
    key: '2',
    label: '表单页',
    path: '/form',
    component: 'Layout',
    children: [
      {
        key: '2-1',
        label: '基础表单',
        path: '/form/basic-form',
        component: '/form/basic-form/index',
        children: undefined
      }
    ],
  },
  {
    key: '3',
    label: '列表页',
    path: '/list',
    component: 'Layout',
    children: [
      {
        key: '3-1',
        label: '搜索列表',
        path: '/list/search',
        component: 'Layout',
        children: [
          {
            key: '3-1-1',
            label: '搜索列表(文章)',
            path: '/list/search/articles',
            component: '/list/search/articles/index',
            children: undefined
          },
          {
            key: '3-1-2',
            label: '搜索列表(项目)',
            path: '/list/search/projects',
            component: '/list/search/projects/index',
            children: undefined
          }
        ]
      }
    ]
  }
];
