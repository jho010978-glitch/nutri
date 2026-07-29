import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Typography } from '../../components/Typography'
import { presetToRange } from '../../lib/dateRange'
import { adminKeys } from '../../queries/adminQueries'
import { CoupangChartWidget } from './components/CoupangChartWidget'
import { KpiCards } from './components/KpiCards'
import { PeriodFilterChips, type PeriodFilterValue } from './components/PeriodFilterChips'
import { PopularKeywordsWidget } from './components/PopularKeywordsWidget'
import { RefreshControl } from './components/RefreshControl'
import { RetentionWidget } from './components/RetentionWidget'
import { SearchTrendWidget } from './components/SearchTrendWidget'
import { ViewsTrendWidget } from './components/ViewsTrendWidget'
import './AdminDashboardPage.css'

export const AdminDashboardPage = () => {
  const queryClient = useQueryClient()
  const [period, setPeriod] = useState<PeriodFilterValue>(() => ({ preset: '7d', range: presetToRange('7d') }))
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshedAt, setRefreshedAt] = useState(() => Date.now())

  // 업데이트 시각은 admin 쿼리 fetch 성공 시점 — 수동 새로고침·60초 폴링·기간 변경 모두 잡힌다
  useEffect(
    () =>
      queryClient.getQueryCache().subscribe((event) => {
        if (
          event.type === 'updated' &&
          event.action.type === 'success' &&
          event.query.queryKey[0] === adminKeys.all[0]
        )
          setRefreshedAt(Date.now())
      }),
    [queryClient],
  )

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: adminKeys.all })
  }

  return (
    <div className="admin-dash">
      <header className="admin-dash-header">
        <Typography as="h1" variant="pageTitle" color="#111">
          관리자 대시보드
        </Typography>
      </header>

      <PeriodFilterChips value={period} onChange={setPeriod} />
      <RefreshControl
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={setAutoRefresh}
        onRefresh={refresh}
        refreshedAt={refreshedAt}
      />

      <KpiCards range={period.range} autoRefresh={autoRefresh} />

      <ViewsTrendWidget range={period.range} autoRefresh={autoRefresh} />
      <SearchTrendWidget range={period.range} autoRefresh={autoRefresh} />
      <CoupangChartWidget range={period.range} autoRefresh={autoRefresh} />

      <PopularKeywordsWidget autoRefresh={autoRefresh} />
      <RetentionWidget autoRefresh={autoRefresh} />
    </div>
  )
}
