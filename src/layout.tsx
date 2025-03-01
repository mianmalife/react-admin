import React, { useEffect, useState } from 'react';
import {
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import type { MenuProps, ConfigProviderProps } from 'antd';
import { ConfigProvider, Layout, Menu, theme, Space, Dropdown, Avatar, Button } from 'antd';
import { menulist } from '~/mock/menu'
import { Outlet, useNavigate, Link } from 'react-router';
import { fakeAuthProvider } from './auth';
// import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs';
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
  paddingTop: 64
};

// interface LinksProps {
//   path: string;
//   children: React.ReactElement;
// }

// function Links({ path, children }: LinksProps) {
//   return (
//     <Link to={path}>{children}</Link>
//   )
// }

// const convertMenuItem = (item: any) => {
//   return {
//     ...item,
//     label: item.children ? item.label : <Links path={item.path}>{item.label}</Links>,
//     children: item.children ? item.children.map((child: any) => convertMenuItem(child)) : undefined,
//   }
// }

// const getMenuItemList = (list: any[]) => {
//   return list.map(item => {
//     return convertMenuItem(item)
//   })
// }

const LayoutApp: React.FC = () => {
  const [locale] = useState<Locale>(zhCN)
  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const navigate = useNavigate()
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();

  useEffect(() => {
    setOpenKeys([menulist[0].key])
    setSelectedKeys([menulist[0].children[0].key])
  }, [])

  const onOpenChange = (openKeys: string[]) => {
    console.log(openKeys)
    setOpenKeys(openKeys)
  }

  const onSelect = ({ item, key, keyPath, selectedKeys, domEvent }: any) =>{
    console.log(item, key, keyPath, selectedKeys, domEvent)
    setSelectedKeys(selectedKeys)
    navigate(item.props.path)
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
            triggerBg: '#fff'
          }
        }
      }}>
      <Layout hasSider>
        <Sider style={siderStyle} theme='light' collapsible collapsed={collapsed} trigger={<Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
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
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            onSelect={onSelect}
            items={menulist}
          />
        </Sider>
        <Layout>
          <Header style={{ background: colorBgContainer }} className='shadow p-0 fixed top-0 left-0 w-100% flex justify-between items-center px-24px z-20'>
            <div className="h-64px flex items-center font-size-20px shadow-sm" style={{ color: colorPrimary }}>React Admin</div>
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