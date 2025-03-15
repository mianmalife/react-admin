import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Alert } from 'antd';
import { useNavigate } from 'react-router';
import { fakeAuthProvider } from '@/auth'
import { useState } from 'react';
import { menulist } from '~/mock/menu';
import { useSiderMenuStore } from '@/store';
import { getTreeFirstGrandson } from '@/shared/util';

interface FormParams {
  username: string,
  password: string
}

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loginIn, setLoginIn] = useState(false)
  const { setMenuData, setSelectedKeys, setOpenKeys } = useSiderMenuStore()
  const navigate = useNavigate()
  const onFinish = async (values: FormParams) => {
    setLoginIn(true)
    try {
      const res = await fakeAuthProvider.signin(values.username, values.password)
      if (res.isAuthenticated) {
        const firstGrandsonKey = getTreeFirstGrandson(menulist)
        const redirectUrl = new URLSearchParams(window.location.search).get('from')
        setMenuData(menulist)
        setSelectedKeys(redirectUrl ? [redirectUrl] : [firstGrandsonKey])
        localStorage.setItem('firstPath', firstGrandsonKey)
        if (redirectUrl) {
          const matchRes = redirectUrl.match(/^\/[^\/]+/)
          if (matchRes) {
            setOpenKeys([matchRes[0]])
          } else {
            setOpenKeys([menulist[0].key])
          }
        } else {
          setOpenKeys([menulist[0].key])
        }
        await navigate(redirectUrl ? redirectUrl : firstGrandsonKey)
      } else {
        setError(res.message);
      }
    } catch (error) {
      console.warn(error)
    } finally {
      setLoginIn(false)
    }
  };
  return (
    <div className="h-screen w-screen overflow-hidden flex bg-gray-50">
      {/* 左侧装饰区域 */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-500 to-violet-500 items-center justify-center relative overflow-hidden">
        <div className="absolute w-full h-full bg-white/10 backdrop-blur-sm" />
        <div className="relative z-1 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">React Admin</h1>
          <p className="text-xl text-white/80">现代化的后台管理系统</p>
        </div>
        {/* 装饰圆形 */}
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/20" />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
      </div>
      
      {/* 右侧登录区域 */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="w-400px">
          <div className="md:hidden text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800">React Admin</h1>
            <p className="mt-2 text-gray-500">现代化的后台管理系统</p>
          </div>
          
          <h2 className="text-2xl font-medium text-gray-800 mb-8">欢迎登录</h2>
          
          <Form
            name="login"
            onFinish={onFinish}
            size="large"
          >
            {error && (
              <Alert
                type="error"
                message="用户名或者密码错误!"
                className="mb-6"
              />
            )}
            
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-300" />}
                placeholder="用户名: admin"
                allowClear
                className="h-45px rounded-lg bg-gray-50 border-gray-200 hover:border-blue-400 transition-colors duration-300"
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-300" />}
                type="password"
                placeholder="密码: 123456"
                allowClear
                className="h-45px rounded-lg bg-gray-50 border-gray-200 hover:border-blue-400 transition-colors duration-300"
              />
            </Form.Item>

            <Form.Item className="mt-8">
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={loginIn}
                className="h-45px bg-blue-500 hover:bg-blue-600 border-0 rounded-lg text-16px font-medium shadow-sm hover:shadow transition-all duration-300"
              >
                {loginIn ? '登录中...' : '登 录'}
              </Button>
            </Form.Item>
          </Form>
          
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-14px">
              系统默认账号：admin / 123456
            </p>
          </div>
        </div>
        
        {/* 版权信息 */}
        <div className="absolute bottom-6 text-center text-gray-400 text-14px">
          <p className='mb-1'>Released under the MIT License.</p>
          <p className='mb-0'>Copyright © 2025-PRESENT Skea</p>
        </div>
      </div>
    </div>
  );
}