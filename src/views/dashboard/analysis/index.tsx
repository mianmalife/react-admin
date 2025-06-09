import { fetchGet } from "@/shared/fetch"
import { isArray } from "@/shared/util"
import { use, useState, Suspense } from "react"
import { Skeleton, Empty, Col, Row, Table, Image } from "antd"
import ReactEChartsCore from "echarts-for-react/lib/core"
import * as echarts from 'echarts/core'
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer
])

const defaultOption = {
  title: {
    subtext: '售价'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    valueFormatter: (v: number) => `${v}＄`
  },
  grid: {
    left: '3%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true
      },
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '机型',
      type: 'bar',
      barWidth: '60%',
      data: []
    }
  ]
}

const columns = [
  {
    title: '',
    dataIndex: 'thumbnail',
    key: 'thumbnail',
    render: (uri: string) => <Image width={60} height={60} src={uri} />
  },
  {
    title: '产品名称',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '产品价格',
    dataIndex: 'price',
    key: 'price'
  },
]

const getSmartPhones = async () => {
  try {
    const res = await fetchGet({ url: 'https://dummyjson.com/products/category/smartphones' })
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
    return { products: [] }
  }
}

const getAllProducts = async () => {
  try {
    const res = await fetchGet({ url: 'https://dummyjson.com/products' })
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
    return { products: [] }
  }
}

function Chart({ promise }: { promise: Promise<{ products: Array<{ title: string, price: string }> }> }) {
  const res = use(promise)
  if (isArray(res?.products) && res.products.length > 0) {
    const option = {
      ...defaultOption,
      xAxis: [
        {
          type: 'category',
          data: res.products.map(item => item.title),
          axisTick: {
            alignWithLabel: true
          },
          name: '机型',
        },
      ],
      series: [
        {
          name: '机型',
          type: 'bar',
          barWidth: '60%',
          data: res.products.map(item => item.price),
        }
      ],
    }
    return (
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: 400 }}
      />
    )
  }
  return (
    <div className="w-100% h-100% flex items-center justify-center">
      <Empty />
    </div>
  )
}

function TableCop({ promise }: { promise: Promise<{ products: Array<{ id: number, title: string, price: string, thumbnail: string }> }> }) {
  const res = use(promise)
  if (isArray(res?.products) && res.products.length > 0) {
    const dataSource = res.products.map(item => ({ ...item, key: item.id }))
    return (
      <Table tableLayout="fixed" scroll={{ y: 400 }} dataSource={dataSource} columns={columns} />
    )
  }
  return (
    <div className="w-100% h-100% flex items-center justify-center">
      <Empty />
    </div>
  )
}
function Products() {
  const [promise] = useState(getAllProducts)
  return (
    <Suspense fallback={<Skeleton active avatar />}>
      <TableCop promise={promise} />
    </Suspense>
  )
}
function PhoneChart() {
  const [promise] = useState(getSmartPhones)
  return (
    <Suspense fallback={<Skeleton active />}>
      <Chart promise={promise} />
    </Suspense>
  )
}

export default function Analysis() {
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col span={12}>
        <PhoneChart />
      </Col>
      <Col span={12}>
        <Products />
      </Col>
    </Row>
  )
}