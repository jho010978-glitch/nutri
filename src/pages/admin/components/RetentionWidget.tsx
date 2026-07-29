import { Typography } from '../../../components/Typography'
import { useRetentionQuery } from '../../../queries/adminQueries'
import type { RetentionVerdict } from '../../../types/admin'
import { numberFormatter } from '../chartConfig'
import { DashboardCard } from './DashboardCard'


// verdict는 서버가 판정해 내려준다(명세 4.3 기준: ≥0.20 PASS / <0.07 FAIL / 그 사이 S4).
// 프론트는 재계산하지 않으므로 서버가 기준을 바꿔도 이 화면은 그대로 따라간다.
const VERDICT_STYLE: Record<RetentionVerdict, { label: string; color: string; background: string }> = {
  PASS: { label: '합격', color: '#12805c', background: '#e6f6ef' },
  FAIL: { label: '미달', color: '#b42318', background: '#fff1f0' },
  S4: { label: '판정 보류', color: '#5f5f5f', background: '#f1f1f1' },
}

// 진척 바 전용 기준선 — 판정 자체는 서버 verdict를 따른다
const PASS_THRESHOLD = 0.2

const COHORT_LABEL: Record<string, string> = {
  warm: '지인 유입',
  cold: '외부 유입',
}

export const RetentionWidget = ({ autoRefresh }: { autoRefresh: boolean }) => {
  const query = useRetentionQuery({ autoRefresh })

  return (
    <DashboardCard
      title="재방문 코호트 (W2)"
      loading={query.isLoading}
      error={query.isError}
      onRetry={() => query.refetch()}
      empty={query.data?.length === 0}
      emptyMessage="집계된 코호트가 없습니다."
    >
      <div className="admin-cohort-list">
        {query.data?.map((row, index) => {
          // 서버가 새 verdict를 추가해도 죽지 않도록 폴백 — 배지에 원문이 그대로 노출된다
          const verdict = VERDICT_STYLE[row.verdict] ?? VERDICT_STYLE.S4
          const ratePct = row.retentionRate * 100
          return (
            <article className="admin-cohort-card" key={`${row.cohort}-${index}`}>
              <div className="admin-cohort-head">
                <Typography as="h3" variant="bodyStrong" color="#111">
                  {COHORT_LABEL[row.cohort] ?? row.cohort}
                </Typography>
                <span
                  className="admin-cohort-badge"
                  style={{ color: verdict.color, background: verdict.background }}
                >
                  {row.verdict} · {verdict.label}
                </span>
              </div>

              <Typography as="strong" variant="pageTitle" color="#131313">
                {ratePct.toFixed(1)}%
              </Typography>

              {/* 합격선(20%)까지의 진척도 — 바가 눈금을 넘으면 PASS */}
              <div className="admin-cohort-bar" aria-hidden="true">
                <span
                  className="admin-cohort-bar-fill"
                  style={{
                    width: `${Math.min((row.retentionRate / PASS_THRESHOLD) * 100, 100)}%`,
                    background: verdict.color,
                  }}
                />
              </div>

              <Typography as="p" variant="label" weight="regular" color="#8a8a8e">
                W1 {numberFormatter.format(row.w1Users)}명 중 {numberFormatter.format(row.retainedUsers)}명 재방문 · 합격선 20%
              </Typography>
            </article>
          )
        })}
      </div>
    </DashboardCard>
  )
}
