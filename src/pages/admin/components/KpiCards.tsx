import { Typography } from '../../../components/Typography'
import { previousRange } from '../../../lib/dateRange'
import {
  isCoupangRangeAllowed,
  useAdminDashboardQuery,
  useCoupangStatsQuery,
  useSearchStatsQuery,
  useViewStatsQuery,
} from '../../../queries/adminQueries'
import type { DateRange } from '../../../types/admin'
import { DashboardCard } from './DashboardCard'

const numberFormatter = new Intl.NumberFormat('ko-KR')
const wonFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
})

const sumBy = <T,>(rows: T[] | undefined, pick: (row: T) => number) =>
  rows === undefined ? undefined : rows.reduce((acc, row) => acc + pick(row), 0)

// 전기간 대비 증감률(%) — 비교 불가(이전 기간 0 또는 데이터 없음)는 null
const deltaPct = (current: number | undefined, previous: number | undefined) =>
  current === undefined || previous === undefined || previous === 0
    ? null
    : ((current - previous) / previous) * 100

const DeltaBadge = ({ delta }: { delta: number | null }) => {
  if (delta === null)
    return (
      <Typography as="span" variant="label" weight="regular" color="#8a8a8e">
        —
      </Typography>
    )
  const color = delta > 0 ? '#e5484d' : delta < 0 ? '#2864dc' : '#8a8a8e'
  const arrow = delta > 0 ? '▲' : delta < 0 ? '▼' : ''
  return (
    <Typography as="span" variant="label" color={color}>
      {arrow} {Math.abs(delta).toFixed(1)}%
    </Typography>
  )
}

type KpiCardsProps = {
  range: DateRange
  autoRefresh: boolean
}

export const KpiCards = ({ range, autoRefresh }: KpiCardsProps) => {
  const prev = previousRange(range)
  const coupangAllowed = isCoupangRangeAllowed(range)

  // 이전 기간은 과거 데이터라 변하지 않으므로 autoRefresh 폴링에서 제외
  const dashboard = useAdminDashboardQuery({ autoRefresh })
  const views = useViewStatsQuery(range, { autoRefresh })
  const prevViews = useViewStatsQuery(prev)
  const searches = useSearchStatsQuery(range, { autoRefresh })
  const prevSearches = useSearchStatsQuery(prev)
  const coupang = useCoupangStatsQuery(range, { autoRefresh })
  const prevCoupang = useCoupangStatsQuery(prev)

  // 카드 표시 여부는 primary 쿼리로만 판정 — 증감 비교(prev) 쿼리는 실패/로딩이어도
  // 해당 카드의 delta만 '—'로 두고 지표 자체는 보여준다
  const primary = [dashboard, views, searches, ...(coupangAllowed ? [coupang] : [])]
  const comparisons = [prevViews, prevSearches, ...(coupangAllowed ? [prevCoupang] : [])]
  const loading = primary.some((q) => q.isLoading)
  const error = primary.some((q) => q.isError)
  const retry = () =>
    [...primary, ...comparisons].filter((q) => q.isError).forEach((q) => q.refetch())

  const totalViews = sumBy(views.data, (r) => r.viewCount)
  const totalSearches = sumBy(searches.data, (r) => r.searchCount)
  const totalClicks = sumBy(coupang.data, (r) => r.click)
  const totalCommission = sumBy(coupang.data, (r) => r.commission)
  const link = dashboard.data?.coupangLinkStatus

  const cards = [
    {
      key: 'views',
      label: '총 조회수',
      value: totalViews === undefined ? '—' : numberFormatter.format(totalViews),
      delta: deltaPct(totalViews, sumBy(prevViews.data, (r) => r.viewCount)),
    },
    {
      key: 'searches',
      label: '총 검색수',
      value: totalSearches === undefined ? '—' : numberFormatter.format(totalSearches),
      delta: deltaPct(totalSearches, sumBy(prevSearches.data, (r) => r.searchCount)),
    },
    {
      key: 'clicks',
      label: '쿠팡 클릭수',
      value: !coupangAllowed || totalClicks === undefined ? '—' : numberFormatter.format(totalClicks),
      delta: coupangAllowed ? deltaPct(totalClicks, sumBy(prevCoupang.data, (r) => r.click)) : undefined,
      sub: coupangAllowed ? undefined : '30일 이하 기간만',
    },
    {
      key: 'commission',
      label: '예상 수익',
      value: !coupangAllowed || totalCommission === undefined ? '—' : wonFormatter.format(totalCommission),
      delta: coupangAllowed
        ? deltaPct(totalCommission, sumBy(prevCoupang.data, (r) => r.commission))
        : undefined,
      sub: coupangAllowed ? undefined : '30일 이하 기간만',
    },
    {
      key: 'linkRate',
      label: '쿠팡 연동률',
      value: link === undefined || link.total === 0 ? '—' : `${((link.linked / link.total) * 100).toFixed(1)}%`,
      sub: link === undefined ? undefined : `${numberFormatter.format(link.linked)}/${numberFormatter.format(link.total)} 연동`,
    },
    {
      key: 'products',
      label: '총 상품 수',
      value: dashboard.data === undefined ? '—' : numberFormatter.format(dashboard.data.totalProducts),
    },
  ]

  return (
    <DashboardCard title="핵심 지표" loading={loading} error={error} onRetry={retry}>
      <div className="admin-kpi-grid">
        {cards.map((card) => (
          <article className="admin-kpi-card" key={card.key}>
            <Typography as="p" variant="label" weight="regular" color="#666">
              {card.label}
            </Typography>
            <Typography as="strong" variant="pageTitle" color="#131313">
              {card.value}
            </Typography>
            {card.delta !== undefined ? <DeltaBadge delta={card.delta} /> : null}
            {card.sub ? (
              <Typography as="span" variant="label" weight="regular" color="#8a8a8e">
                {card.sub}
              </Typography>
            ) : null}
          </article>
        ))}
      </div>
    </DashboardCard>
  )
}
