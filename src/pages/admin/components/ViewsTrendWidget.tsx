import { useViewStatsQuery } from '../../../queries/adminQueries'
import type { DateRange } from '../../../types/admin'
import { DashboardCard } from './DashboardCard'
import { ChartLegend, TrendChart } from './TrendChart'

const SERIES = [
  { key: 'viewCount', name: '조회수', color: '#e5484d' },
  { key: 'uniqueProductCount', name: '조회 상품 수', color: '#2864dc' },
] as const

type ViewsTrendWidgetProps = {
  range: DateRange
  autoRefresh: boolean
}

export const ViewsTrendWidget = ({ range, autoRefresh }: ViewsTrendWidgetProps) => {
  const query = useViewStatsQuery(range, { autoRefresh })

  return (
    <DashboardCard
      title="상품 조회수 추세"
      loading={query.isLoading}
      error={query.isError}
      onRetry={() => query.refetch()}
      empty={query.data?.length === 0}
      headerExtra={<ChartLegend series={[...SERIES]} />}
    >
      <TrendChart data={query.data ?? []} series={[SERIES[0], SERIES[1]]} />
    </DashboardCard>
  )
}
