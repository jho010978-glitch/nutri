import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { isCoupangRangeAllowed, useCoupangStatsQuery } from '../../../queries/adminQueries'
import type { DateRange } from '../../../types/admin'
import { CHART_HEIGHT, axisStyle, gridStroke, toShortDate, tooltipStyle } from '../chartConfig'
import { DashboardCard } from './DashboardCard'
import { ChartLegend } from './TrendChart'

const numberFormatter = new Intl.NumberFormat('ko-KR')
const wonFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
})

// 막대=건수(좌축), 선=금액(우축) — 단위가 달라 이중 Y축 (명세 3.2 (5))
const COUNT_SERIES = [
  { key: 'click', name: '클릭', color: '#f0a8aa' },
  { key: 'orderCount', name: '주문', color: '#e5484d' },
] as const
const MONEY_SERIES = [
  { key: 'gmv', name: '거래액', color: '#2864dc' },
  { key: 'commission', name: '수익', color: '#12a594' },
] as const

const compactWon = (value: number) =>
  value >= 10000 ? `${Math.round(value / 10000)}만` : numberFormatter.format(value)

const MONEY_NAMES = new Set<string>(MONEY_SERIES.map((s) => s.name))

const formatCoupangValue = (value: unknown, name: unknown) => {
  const label = String(name ?? '')
  if (typeof value !== 'number') return [String(value ?? ''), label] as [string, string]
  return [MONEY_NAMES.has(label) ? wonFormatter.format(value) : numberFormatter.format(value), label] as [
    string,
    string,
  ]
}

type CoupangChartWidgetProps = {
  range: DateRange
  autoRefresh: boolean
}

export const CoupangChartWidget = ({ range, autoRefresh }: CoupangChartWidgetProps) => {
  const allowed = isCoupangRangeAllowed(range)
  const query = useCoupangStatsQuery(range, { autoRefresh })

  if (!allowed)
    return (
      <DashboardCard title="쿠팡 파트너스 성과" empty emptyMessage="쿠팡 통계는 30일 이하 기간만 조회할 수 있습니다." />
    )

  return (
    <DashboardCard
      title="쿠팡 파트너스 성과"
      loading={query.isLoading}
      error={query.isError}
      onRetry={() => query.refetch()}
      empty={query.data?.length === 0}
      headerExtra={<ChartLegend series={[...COUNT_SERIES, ...MONEY_SERIES]} />}
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <ComposedChart data={query.data ?? []} margin={{ top: 4, right: -12, bottom: 0, left: -18 }}>
          <CartesianGrid stroke={gridStroke} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={toShortDate}
            tick={axisStyle}
            tickLine={false}
            axisLine={false}
            minTickGap={16}
          />
          <YAxis yAxisId="count" tick={axisStyle} tickLine={false} axisLine={false} width={52} />
          <YAxis
            yAxisId="money"
            orientation="right"
            tickFormatter={compactWon}
            tick={axisStyle}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip {...tooltipStyle} formatter={formatCoupangValue} />
          {COUNT_SERIES.map((s) => (
            <Bar key={s.key} yAxisId="count" dataKey={s.key} name={s.name} fill={s.color} radius={[3, 3, 0, 0]} />
          ))}
          {MONEY_SERIES.map((s) => (
            <Line
              key={s.key}
              yAxisId="money"
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={query.data?.length === 1 ? { r: 4 } : false}
              activeDot={{ r: 4 }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </DashboardCard>
  )
}
