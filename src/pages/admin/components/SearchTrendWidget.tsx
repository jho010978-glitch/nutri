import { useSearchStatsQuery } from '../../../queries/adminQueries'
import type { DateRange } from '../../../types/admin'
import { DashboardCard } from './DashboardCard'
import { ChartLegend, TrendChart } from './TrendChart'

const SERIES = [
  { key: 'searchCount', name: '검색수', color: '#e5484d' },
  { key: 'uniqueKeywordCount', name: '검색어 종류', color: '#2864dc' },
] as const

type SearchTrendWidgetProps = {
  range: DateRange
  autoRefresh: boolean
}

export const SearchTrendWidget = ({ range, autoRefresh }: SearchTrendWidgetProps) => {
  const query = useSearchStatsQuery(range, { autoRefresh })

  return (
    <DashboardCard
      title="검색량 추세"
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
