import { useState, version } from 'react';
import enUS from 'antd/locale/en_US'
// import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'
import { ConfigProvider, ConfigProviderProps, Select, DatePicker } from 'antd'
import { Outlet } from 'react-router';
type Locale = ConfigProviderProps['locale']
dayjs.locale('en')
const { Option } = Select

export default function Layout() {
  const [locale] = useState<Locale>(enUS)
  return (
    <ConfigProvider locale={locale}>
      <Select showSearch className='w-[180px]'>
        <Option value="jack">jack</Option>
        <Option value="lucy">lucy</Option>
      </Select>
      <DatePicker />
      <div className='font-size-30px m-50 bg-#4096ff bg-clip-text color-transparent'>Hello React{version}</div>
      <Outlet />
    </ConfigProvider>
  )
}