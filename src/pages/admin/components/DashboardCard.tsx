import type { ReactNode } from 'react'
import { Typography } from '../../../components/Typography'

type DashboardCardProps = {
  title: string
  headerExtra?: ReactNode
  loading?: boolean
  error?: boolean
  onRetry?: () => void
  empty?: boolean
  emptyMessage?: string
  children?: ReactNode
}

// 위젯별 독립 상태 표시 — 우선순위: 로딩 > 에러 > 빈 데이터 > 내용 (명세 3.2 (9))
export const DashboardCard = ({
  title,
  headerExtra,
  loading,
  error,
  onRetry,
  empty,
  emptyMessage = '표시할 데이터가 없습니다.',
  children,
}: DashboardCardProps) => (
  <section className="admin-widget" aria-label={title}>
    <div className="admin-widget-head">
      <Typography as="h2" variant="sectionTitle" color="#111">
        {title}
      </Typography>
      {headerExtra}
    </div>

    {loading ? (
      <div className="admin-skeleton" role="status" aria-live="polite" aria-label={`${title} 불러오는 중`}>
        <div className="admin-skeleton-bar" style={{ width: '60%' }} />
        <div className="admin-skeleton-bar" style={{ width: '100%' }} />
        <div className="admin-skeleton-bar" style={{ width: '80%' }} />
      </div>
    ) : error ? (
      <div className="admin-widget-state" role="alert">
        <Typography as="p" variant="label" weight="regular" color="#b42318">
          데이터를 불러오지 못했습니다.
        </Typography>
        {onRetry ? (
          <button type="button" className="admin-widget-retry" onClick={onRetry}>
            다시 시도
          </button>
        ) : null}
      </div>
    ) : empty ? (
      <div className="admin-widget-state">
        <Typography as="p" variant="label" weight="regular" color="#8a8a8e">
          {emptyMessage}
        </Typography>
      </div>
    ) : (
      children
    )}
  </section>
)
