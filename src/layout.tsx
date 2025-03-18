import React, { useState, useEffect, useRef } from 'react';
import {
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import type { MenuProps, ConfigProviderProps } from 'antd';
import { ConfigProvider, Layout, Menu, theme, Space, Dropdown, Avatar, Button } from 'antd';
import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import { fakeAuthProvider } from './auth';
// import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs';
import { useSiderMenuStore } from './store/menu';
import SvgIcon from './components/SvgIcon';
type Locale = ConfigProviderProps['locale']
dayjs.locale('en')

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  paddingTop: 48
};

interface LinksProps {
  path: string;
  children: React.ReactElement;
}

function Links({ path, children }: LinksProps) {
  return (
    <Link to={path}>{children}</Link>
  )
}

const convertMenuItem = (item: any) => {
  return {
    ...item,
    label: item.children ? item.label : <Links path={item.key}>{item.label}</Links>,
    icon: item.children ? <SvgIcon name={item.meta?.icon} /> : null,
    children: item.children ? item.children.map((child: any) => convertMenuItem(child)) : undefined,
  }
}

const getMenuItemList = (list: any[]) => {
  return list.map(item => {
    return convertMenuItem(item)
  })
}

const LayoutApp: React.FC = () => {
  const [locale] = useState<Locale>(zhCN)
  const [collapsed, setCollapsed] = useState(false)
  const { menuList, openKeys, setOpenKeys, selectedKeys, setSelectedKeys } = useSiderMenuStore()
  const navigate = useNavigate()
  const location = useLocation()
  const preOpenkeys = useRef<any>([...openKeys])
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();

  useEffect(() => {
    setSelectedKeys([location.pathname])
  }, [location])

  useEffect(() => {
    if (!collapsed) {
      if (preOpenkeys.current.length > 0) {
        setOpenKeys(preOpenkeys.current)
      }
    }
  }, [collapsed])
  const onOpenChange = (openKeys: string[]) => {
    if (openKeys.length > 0) {
      preOpenkeys.current = openKeys
    }
    setOpenKeys(openKeys)
  }

  //@ts-ignore
  const onSelect = ({ item, key, keyPath, selectedKeys, domEvent }: any) => {
    setOpenKeys(keyPath)
  }

  const logOut = async () => {
    const res = await fakeAuthProvider.signout()
    if (res) {
      await navigate('/')
    }
  }

  const optionOpera: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a onClick={logOut}>
          <Space>
            <LogoutOutlined />退出登录
          </Space>
        </a>
      ),
    },
  ]

  return (
    <ConfigProvider locale={locale}
      theme={{
        components: {
          Menu: {
            activeBarBorderWidth: 0
          },
          Layout: {
            headerBg: '#fff',
            headerPadding: '0 28px',
            triggerBg: '#fff',
            headerHeight: 48
          }
        }
      }}>
      <Layout hasSider>
        <Sider style={siderStyle} theme='light' collapsible collapsed={collapsed} trigger={<Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'start',
            paddingLeft: 24,
          }}
        />}>
          <Menu
            theme="light"
            mode="inline"
            onOpenChange={onOpenChange}
            onSelect={onSelect}
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            items={getMenuItemList(menuList)}
          />
        </Sider>
        <Layout>
          <Header style={{ background: colorBgContainer }} className='p-0 fixed top-0 left-0 w-100% flex justify-between items-center px-24px z-20 border-b-#dcdfe6 border-b-solid border-b-1px'>
            <div className="h-48px flex items-center font-size-18px" style={{ color: colorPrimary }}>React Admin</div>
            <Dropdown menu={{ items: optionOpera }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {localStorage.getItem('username')}
                </Space>
              </a>
            </Dropdown>
          </Header>
          <Header style={{ padding: 0, background: colorBgContainer, position: 'sticky', top: 0, backgroundColor: 'transparent' }} />
          <Content style={{ margin: '10px', overflow: 'initial' }}>
            <div
              style={{
                padding: 10,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', padding: '0 10px 10px' }}>
            Copyright © 2025-PRESENT Skea
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default LayoutApp;