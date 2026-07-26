import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Typography } from '../../components/Typography'
import { presetToRange } from '../../lib/dateRange'
import { adminKeys } from '../../queries/adminQueries'
import { KpiCards } from './components/KpiCards'
import { PeriodFilterChips, type PeriodFilterValue } from './components/PeriodFilterChips'
import { RefreshControl } from './components/RefreshControl'
import { DashboardCard } from './components/DashboardCard'
import './AdminDashboardPage.css'

const Placeholder = ({ note }: { note: string }) => (
  <div className="admin-widget-placeholder">
    <Typography as="span" variant="label" weight="regular" color="#a0a0a0">
      {note}
    </Typography>
  </div>
)

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

      {/* 아래 위젯은 19~20단계에서 구현 — period.range·autoRefresh를 쿼리 훅에 연결한다 */}
      <DashboardCard title="상품 조회수 추세">
        <Placeholder note="조회수 차트 (19단계)" />
      </DashboardCard>
      <DashboardCard title="검색량 추세">
        <Placeholder note="검색량 차트 (19단계)" />
      </DashboardCard>
      <DashboardCard title="쿠팡 파트너스 성과">
        <Placeholder note="쿠팡 차트 (19단계)" />
      </DashboardCard>
      <DashboardCard title="인기 검색어 TOP 10">
        <Placeholder note="검색어 순위 (20단계)" />
      </DashboardCard>
      <DashboardCard title="재방문 코호트">
        <Placeholder note="코호트 카드 (20단계)" />
      </DashboardCard>
    </div>
  )
}
