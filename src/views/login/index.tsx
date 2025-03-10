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
        console.log(redirectUrl, 'redirectUrl')
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
    <div className='flex justify-center items-center h-100%'>
      <div className='flex flex-col border-gray-200 border border-solid rounded px-24px pt-24px shadow-sm'>
        <div className='font-size-24px mb-30px text-center font-600'>React Admin</div>
        <Form
          name="login"
          className='w-400px'
          onFinish={onFinish}
          size='large'
        >
          { error && <Alert type='error' message='用户名或者密码错误!' className='m-b-24px' /> }
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" allowClear />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} type="password" placeholder="密码" allowClear />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loginIn}>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}