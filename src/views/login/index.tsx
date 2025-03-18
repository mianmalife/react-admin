import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Alert, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router';
import { useSiderMenuStore } from '@/store/menu';
import { useUserStore } from '@/store/user';
import { getTreeFirstGrandson } from '@/shared/util';

interface FormParams {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getMenuList, setSelectedKeys, setOpenKeys } = useSiderMenuStore();
  const { login, loading, error } = useUserStore();

  const handleLogin = async (values: FormParams) => {
    try {
      const { success, message: loginMessage } = await login(values.username, values.password);

      if (success) {
        const menuList = await getMenuList()
        // 处理重定向
        const redirectUrl = searchParams.get('from');
        const firstGrandsonKey = getTreeFirstGrandson(menuList);
        const targetPath = redirectUrl || firstGrandsonKey;

        // 设置菜单状态
        setSelectedKeys([targetPath]);
        if (redirectUrl) {
          const matchRes = redirectUrl.match(/^\/[^\/]+/);
          setOpenKeys(matchRes ? [matchRes[0]] : [menuList[0].key]);
        } else {
          setOpenKeys([menuList[0].key]);
        }
        // 存储首次访问路径
        localStorage.setItem('firstPath', firstGrandsonKey);

        // 显示成功消息
        message.open({ content: loginMessage, type: 'success' });

        // 跳转
        await navigate(targetPath);
      }
    } catch (error) {
      console.error('Login error:', error);
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
            form={form}
            name="login"
            onFinish={handleLogin}
            size="large"
            autoComplete="off"
          >
            {error && (
              <Alert
                type="error"
                message={error}
                className="mb-6"
                showIcon
              />
            )}

            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' }
              ]}
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
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-300" />}
                type="password"
                placeholder="密码: 123456"
                allowClear
                className="h-45px rounded-lg bg-gray-50 border-gray-200 hover:border-blue-400 transition-colors duration-300"
              />
            </Form.Item>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={loading}
                className="h-45px bg-blue-500 hover:bg-blue-600 border-0 rounded-lg text-16px font-medium shadow-sm hover:shadow transition-all duration-300"
              >
                {loading ? '登录中...' : '登 录'}
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