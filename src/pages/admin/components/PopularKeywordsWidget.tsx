import { Typography } from '../../../components/Typography'
import { usePopularKeywordsQuery } from '../../../queries/adminQueries'
import type { KeywordChange } from '../../../types/admin'
import { DashboardCard } from './DashboardCard'

// 신규 진입은 이전 순위가 없어 delta를 표시하지 않는다
const CHANGE_STYLE: Record<KeywordChange, { mark: string; color: string; label: string }> = {
  UP: { mark: '▲', color: '#e5484d', label: '상승' },
  DOWN: { mark: '▼', color: '#2864dc', label: '하락' },
  SAME: { mark: '−', color: '#8a8a8e', label: '변동 없음' },
  NEW: { mark: 'NEW', color: '#12a594', label: '신규' },
}

const ChangeMark = ({ change, rankDelta }: { change: KeywordChange; rankDelta: number }) => {
  // 서버가 새 enum을 추가해도 죽지 않도록 폴백 — 알 수 없는 값은 '변동 없음'으로 표시
  const style = CHANGE_STYLE[change] ?? CHANGE_STYLE.SAME
  const hasDelta = change === 'UP' || change === 'DOWN'
  return (
    <Typography
      as="span"
      variant="label"
      color={style.color}
      aria-label={hasDelta ? `${style.label} ${Math.abs(rankDelta)}단계` : style.label}
    >
      {style.mark}
      {hasDelta ? ` ${Math.abs(rankDelta)}` : ''}
    </Typography>
  )
}

export const PopularKeywordsWidget = ({ autoRefresh }: { autoRefresh: boolean }) => {
  const query = usePopularKeywordsQuery({ autoRefresh })

  return (
    <DashboardCard
      title="인기 검색어 TOP 10"
      loading={query.isLoading}
      error={query.isError}
      onRetry={() => query.refetch()}
      empty={query.data?.length === 0}
      emptyMessage="집계된 검색어가 없습니다."
    >
      <ol className="admin-keyword-list">
        {query.data?.map((row, index) => (
          <li className="admin-keyword-row" key={`${row.rank}-${row.keyword}-${index}`}>
            <Typography as="span" variant="label" color={row.rank <= 3 ? '#e5484d' : '#8a8a8e'} className="admin-keyword-rank">
              {row.rank}
            </Typography>
            <Typography as="span" variant="body" className="admin-keyword-text">
              {row.keyword}
            </Typography>
            <ChangeMark change={row.change} rankDelta={row.rankDelta} />
          </li>
        ))}
      </ol>
    </DashboardCard>
  )
}
