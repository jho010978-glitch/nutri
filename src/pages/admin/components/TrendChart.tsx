import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Typography } from '../../../components/Typography'
import {
  CHART_HEIGHT,
  axisStyle,
  formatCount,
  gridStroke,
  numberFormatter,
  toShortDate,
  tooltipStyle,
  type ChartSeries,
} from '../chartConfig'

// 하루짜리 기간은 추세가 없다 — 축만 남은 빈 차트 대신 값을 그대로 보여준다
export const SingleDayStats = ({ series, row }: { series: ChartSeries[]; row: Record<string, unknown> }) => (
  <dl className="admin-single-day">
    {series.map((s) => {
      const value = row[s.key]
      return (
        <div className="admin-single-day-item" key={s.key}>
          <dt>
            <span className="admin-chart-legend-dot" style={{ background: s.color }} aria-hidden="true" />
            <Typography as="span" variant="label" weight="regular" color="#666">
              {s.name}
            </Typography>
          </dt>
          <dd>
            <Typography as="strong" variant="pageTitle" color="#131313">
              {typeof value !== 'number' ? '—' : s.format ? s.format(value) : numberFormatter.format(value)}
            </Typography>
          </dd>
        </div>
      )
    })}
  </dl>
)

type TrendChartProps<T> = {
  data: T[]
  series: [ChartSeries, ChartSeries]
}

// 조회수·검색량 공통 — 일별 2계열 선 그래프
export const TrendChart = <T extends { date: string }>({ data, series }: TrendChartProps<T>) => {
  if (data.length === 1) return <SingleDayStats series={series} row={data[0]} />

  return (
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
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

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
