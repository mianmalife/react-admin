import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { fakeAuthProvider } from './auth';
import enUS from 'antd/locale/en_US'
// import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'
import { LaptopOutlined, NotificationOutlined, UserOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, ConfigProvider, ConfigProviderProps, Avatar, Space, Dropdown, Button } from 'antd';

const { Header, Content, Sider } = Layout;
type Locale = ConfigProviderProps['locale']
dayjs.locale('en')

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
}

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: Array.from({ length: 4 }).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

export default function LayoutPage() {
  const [locale] = useState<Locale>(enUS)
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary, colorBorder },
  } = theme.useToken()
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
      <Layout className='h-100%'>
        <Header style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${colorBorder}` }}>
          <div className="w-172px h-32px line-height-32px my-16px font-size-20px" style={{ color: colorPrimary }}>React Admin</div>
          <div className='flex-1 flex items-center'>
            <Menu
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              items={items1}
              style={{ flex: 1, minWidth: 0, borderBottom: `1px solid ${colorBorder}` }}
            />
            <Dropdown menu={{ items: optionOpera }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {localStorage.getItem('username')}
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Layout>
          <Sider trigger={<Button
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
          />} collapsible collapsed={collapsed} style={{ background: colorBgContainer, ...siderStyle }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', position: 'relative' }}
              items={items2}
            >
            </Menu>
          </Sider>
          <Layout style={{ padding: '10px' }}>
            <Content
              style={{
                padding: 10,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}