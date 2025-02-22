import enUS from 'antd/locale/en_US'
// import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'
import { ConfigProvider, ConfigProviderProps, Select, DatePicker } from 'antd'
import './App.css'
import { useState } from 'react';
type Locale = ConfigProviderProps['locale']
dayjs.locale('en')
const { Option } = Select

function App() {
  const [locale] = useState<Locale>(enUS)
  return (
    <ConfigProvider locale={locale}>
      <Select showSearch className='w-[200px]'>
        <Option value="jack">jack</Option>
        <Option value="lucy">lucy</Option>
      </Select>
      <DatePicker />
      <div className='font-size-30px m-50 bg-#4096ff bg-clip-text color-transparent'>Hello React</div>
    </ConfigProvider>
  )
}

export default App
