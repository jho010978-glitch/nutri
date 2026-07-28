import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  CHART_HEIGHT,
  axisStyle,
  formatCount,
  gridStroke,
  toShortDate,
  tooltipStyle,
  type ChartSeries,
} from '../chartConfig'

type TrendChartProps<T> = {
  data: T[]
  series: [ChartSeries, ChartSeries]
}

// 조회수·검색량 공통 — 일별 2계열 선 그래프
export const TrendChart = <T extends { date: string }>({ data, series }: TrendChartProps<T>) => (
  // 하루짜리 기간은 선을 그릴 수 없으므로 점으로 표시한다
  <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
    <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
      <CartesianGrid stroke={gridStroke} vertical={false} />
      <XAxis
        dataKey="date"
        tickFormatter={toShortDate}
        tick={axisStyle}
        tickLine={false}
        axisLine={false}
        minTickGap={16}
      />
      <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={52} />
      <Tooltip {...tooltipStyle} formatter={formatCount} />
      {series.map((s) => (
        <Line
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.name}
          stroke={s.color}
          strokeWidth={2}
          dot={data.length === 1 ? { r: 4 } : false}
          activeDot={{ r: 4 }}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
)

export const ChartLegend = ({ series }: { series: ChartSeries[] }) => (
  <ul className="admin-chart-legend">
    {series.map((s) => (
      <li key={s.key}>
        <span className="admin-chart-legend-dot" style={{ background: s.color }} aria-hidden="true" />
        {s.name}
      </li>
    ))}
  </ul>
)
