export const menulist = [
  {
    key: '/dashboard',
    label: 'Dashboard',
    meta: {
      icon: 'dashboard-outlined'
    },
    children: [
      {
        key: '/',
        label: '分析页',
        children: undefined
      },
      {
        key: '/dashboard/monitor',
        label: '监控页',
        children: undefined
      },
    ],
  },
  {
    key: '/form',
    label: '表单页',
    meta: {
      icon: 'form-outlined'
    },
    children: [
      {
        key: '/form/basic-form',
        label: '基础表单',
        children: undefined
      }
    ],
  },
  {
    key: '/list',
    label: '列表页',
    meta: {
      icon: 'table-outlined'
    },
    children: [
      {
        key: '/list/search',
        label: '搜索列表',
        children: [
          {
            key: '/list/search/articles',
            label: '搜索列表(文章)',
            children: undefined
          },
          {
            key: '/list/search/projects',
            label: '搜索列表(项目)',
            children: undefined
          }
        ]
      }
    ]
  }
];
