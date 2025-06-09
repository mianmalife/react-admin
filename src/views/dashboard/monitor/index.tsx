import { useEffect, useRef } from "react";
import * as echarts from "echarts/core"
import { TitleComponent, TooltipComponent } from "echarts/components"
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([
  TitleComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer
])

let now = new Date(2000, 1, 1)
let value = Math.random() * 1000
const oneDay = 24 * 3600 * 1000

const randomData = () => {
  now = new Date(+now + oneDay);
  value += Math.random() * 21 - 10;
  return {
    name: now.toString(),
    value: [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
      Math.round(value)
    ]
  }
}

const initData = Array.from({ length: 1000 }, () => randomData())

export default function Monitor() {
  const chartRef = useRef(null)
  useEffect(() => {
    if (chartRef.current && echarts.getInstanceByDom(chartRef.current)) {
      echarts.dispose(chartRef.current)
    }
    let myChart = echarts.init(chartRef.current)
    myChart.setOption({
      title: {
        text: 'Dynamic Data & Time Axis'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params: Array<{ name: string }>) {
          let p = params[0] as { name: string, value: Array<[]> };
          var date = new Date(p.name);
          return (
            date.getDate() +
            '/' +
            (date.getMonth() + 1) +
            '/' +
            date.getFullYear() +
            ' : ' +
            p.value[1]
          );
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: 'Fake Data',
          type: 'line',
          showSymbol: false,
          data: initData
        }
      ]
    })
    const intervalId = setInterval(() => {
      for (var i = 0; i < 5; i++) {
        initData.shift();
        initData.push(randomData());
      }
      myChart.setOption({
        series: [
          {
            data: initData
          }
        ]
      })
    }, 1000)
    function handleResize() {
      myChart.resize()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      clearInterval(intervalId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <>
      <div className="w-100% h-400px" ref={chartRef}></div>
    </>
  )
}