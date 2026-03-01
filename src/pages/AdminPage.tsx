import { useState } from 'react'
import { Typography } from '../components/Typography'
import {
  useClickStatsQuery,
  useDashboardQuery,
  useProductsQuery,
  useSearchStatsQuery,
} from '../queries/adminQueries'
import './AdminPage.css'

const numberFormatter = new Intl.NumberFormat('ko-KR')
const wonFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
})

const formatNumber = (value: number) => numberFormatter.format(value)
const formatWon = (value: number) => wonFormatter.format(value)

const LoadingBlock = ({ label }: { label: string }) => (
  <div className="admin-loading" role="status" aria-live="polite">
    <Typography as="span" variant="label" weight="regular" color="#757575">
      {label}
    </Typography>
  </div>
)

const ErrorBlock = ({ message }: { message: string }) => (
  <div className="admin-error" role="alert">
    <Typography as="span" variant="label" weight="regular" color="#b42318">
      {message}
    </Typography>
  </div>
)

type BarItem = {
  id: string
  label: string
  count: number
}

const RankBars = ({ items, max }: { items: BarItem[]; max: number }) => (
  <ul className="admin-rank-list">
    {items.map((item) => (
      <li key={item.id} className="admin-rank-row">
        <Typography as="span" variant="label" weight="regular" color="#5f5f5f" className="admin-rank-label">
          {item.label}
        </Typography>
        <div className="admin-rank-bar-wrap" aria-hidden="true">
          <div className="admin-rank-bar" style={{ width: `${Math.max((item.count / max) * 100, 4)}%` }} />
        </div>
        <Typography as="span" variant="label" weight="regular" color="#777">
          {item.count}
        </Typography>
      </li>
    ))}
  </ul>
)

export const AdminPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const dashboardQuery = useDashboardQuery()
  const clickStatsQuery = useClickStatsQuery()
  const searchStatsQuery = useSearchStatsQuery()
  const productsQuery = useProductsQuery(searchQuery)

  const clickMax = Math.max(...(clickStatsQuery.data?.topItems.map((item) => item.count) ?? [1]))
  const searchMax = Math.max(...(searchStatsQuery.data?.topKeywords.map((item) => item.count) ?? [1]))

  return (
    <section className="admin-page" aria-label="관리자 페이지">
      <section className="admin-section">
        <Typography as="h2" variant="pageTitle" color="#111">
          데이터 관리 대시보드
        </Typography>

        {dashboardQuery.isLoading ? <LoadingBlock label="대시보드 데이터를 불러오는 중..." /> : null}
        {dashboardQuery.isError ? <ErrorBlock message="대시보드 데이터를 불러오지 못했습니다." /> : null}

        {dashboardQuery.data ? (
          <>
            <div className="admin-grid-card">
              <article className="admin-card">
                <Typography as="p" variant="label" weight="regular" color="#666">
                  총 상품 수
                </Typography>
                <Typography as="strong" variant="pageTitle" color="#131313">
                  {formatNumber(dashboardQuery.data.summary.totalProducts)}
                </Typography>
              </article>
              <article className="admin-card">
                <Typography as="p" variant="label" weight="regular" color="#666">
                  카테고리 수
                </Typography>
                <Typography as="strong" variant="pageTitle" color="#131313">
                  {formatNumber(dashboardQuery.data.summary.totalCategories)}
                </Typography>
              </article>
              <article className="admin-card">
                <Typography as="p" variant="label" weight="regular" color="#666">
                  평균 영양점수
                </Typography>
                <Typography as="strong" variant="pageTitle" color="#131313">
                  {formatNumber(dashboardQuery.data.summary.averageScore)}
                </Typography>
              </article>
              <article className="admin-card">
                <Typography as="p" variant="label" weight="regular" color="#666">
                  마지막 업데이트
                </Typography>
                <Typography as="strong" variant="bodyStrong" color="#131313">
                  {dashboardQuery.data.summary.lastUpdatedAt}
                </Typography>
              </article>
            </div>

            <div className="admin-subsection">
              <Typography as="h3" variant="sectionTitle" color="#111">
                쿠팡 파트너스 API 연동
              </Typography>
              <div className="admin-grid-card admin-grid-card-3">
                <article className="admin-card">
                  <Typography as="p" variant="label" weight="regular" color="#666">
                    전체 상품
                  </Typography>
                  <Typography as="strong" variant="pageTitle" color="#131313">
                    {formatNumber(dashboardQuery.data.integration.total)}
                  </Typography>
                </article>
                <article className="admin-card">
                  <Typography as="p" variant="label" weight="regular" color="#666">
                    이미지 있음
                  </Typography>
                  <Typography as="strong" variant="pageTitle" color="#131313">
                    {formatNumber(dashboardQuery.data.integration.withImage)}
                  </Typography>
                </article>
                <article className="admin-card">
                  <Typography as="p" variant="label" weight="regular" color="#666">
                    쿠팡 연동
                  </Typography>
                  <Typography as="strong" variant="pageTitle" color="#131313">
                    {formatNumber(dashboardQuery.data.integration.linkedToCoupang)}
                  </Typography>
                </article>
              </div>

              <div className="admin-progress-meta">
                <Typography as="span" variant="label" weight="regular" color="#666">
                  미연동: {formatNumber(dashboardQuery.data.integration.missingCount)}개
                </Typography>
              </div>
              <div className="admin-progress" aria-hidden="true">
                <span
                  className="admin-progress-fill"
                  style={{
                    width: `${Math.min(
                      (dashboardQuery.data.integration.missingCount / dashboardQuery.data.integration.total) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>

              <Typography as="h4" variant="bodyStrong" color="#111">
                API 호출 제한 상태 (클라이언트)
              </Typography>
              <div className="admin-grid-card">
                {dashboardQuery.data.apiLimits.map((api) => (
                  <article className="admin-card" key={api.key}>
                    <Typography as="p" variant="label" weight="regular" color="#666">
                      {api.label}
                    </Typography>
                    <Typography as="strong" variant="bodyStrong" color="#131313">
                      {formatNumber(api.used)}/{formatNumber(api.limit)}
                    </Typography>
                    <div className="admin-progress" aria-hidden="true">
                      <span className="admin-progress-fill" style={{ width: `${Math.min((api.used / api.limit) * 100, 100)}%` }} />
                    </div>
                    <Typography as="span" variant="label" weight="regular" color="#8b8b8b">
                      {api.resetInSeconds}초
                    </Typography>
                  </article>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>

      <section className="admin-section">
        <Typography as="h2" variant="pageTitle" color="#111">
          제휴 클릭 통계
        </Typography>
        <div className="admin-grid-stats">
          <article className="admin-panel">
            <div className="admin-panel-head">
              <Typography as="h3" variant="sectionTitle" color="#111">
                링크 클릭 통계
              </Typography>
              <Typography as="span" variant="label" weight="regular" color="#757575">
                {clickStatsQuery.data ? `최근 업데이트: ${clickStatsQuery.data.updatedAt}` : ''}
              </Typography>
            </div>
            {clickStatsQuery.isLoading ? <LoadingBlock label="클릭 통계를 불러오는 중..." /> : null}
            {clickStatsQuery.isError ? <ErrorBlock message="클릭 통계를 불러오지 못했습니다." /> : null}
            {clickStatsQuery.data ? (
              <>
                <div className="admin-grid-card admin-grid-card-3">
                  <article className="admin-card">
                    <Typography as="p" variant="label" weight="regular" color="#666">
                      총 클릭 수
                    </Typography>
                    <Typography as="strong" variant="pageTitle" color="#131313">
                      {formatNumber(clickStatsQuery.data.totalClicks)}
                    </Typography>
                  </article>
                  <article className="admin-card">
                    <Typography as="p" variant="label" weight="regular" color="#666">
                      쿠팡 클릭
                    </Typography>
                    <Typography as="strong" variant="pageTitle" color="#2864dc">
                      {formatNumber(clickStatsQuery.data.coupangClicks)}
                    </Typography>
                  </article>
                  <article className="admin-card">
                    <Typography as="p" variant="label" weight="regular" color="#666">
                      기타 링크 클릭
                    </Typography>
                    <Typography as="strong" variant="pageTitle" color="#131313">
                      {formatNumber(clickStatsQuery.data.otherClicks)}
                    </Typography>
                  </article>
                </div>
                <RankBars items={clickStatsQuery.data.topItems} max={clickMax} />
              </>
            ) : null}
          </article>

          <article className="admin-panel">
            <div className="admin-panel-head">
              <Typography as="h3" variant="sectionTitle" color="#111">
                검색량 통계
              </Typography>
            </div>
            {searchStatsQuery.isLoading ? <LoadingBlock label="검색 통계를 불러오는 중..." /> : null}
            {searchStatsQuery.isError ? <ErrorBlock message="검색 통계를 불러오지 못했습니다." /> : null}
            {searchStatsQuery.data ? (
              <>
                <div className="admin-grid-card">
                  <article className="admin-card">
                    <Typography as="p" variant="label" weight="regular" color="#666">
                      총 검색 수
                    </Typography>
                    <Typography as="strong" variant="pageTitle" color="#131313">
                      {formatNumber(searchStatsQuery.data.totalSearches)}
                    </Typography>
                  </article>
                </div>
                <RankBars items={searchStatsQuery.data.topKeywords} max={searchMax} />
              </>
            ) : null}
          </article>
        </div>
      </section>

      <section className="admin-section">
        <Typography as="h2" variant="pageTitle" color="#111">
          등록된 데이터 조회
        </Typography>
        <div className="admin-toolbar">
          <input
            className="admin-input"
            type="text"
            value={searchQuery}
            placeholder="상품명, 카테고리, 제조사 검색"
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        {productsQuery.isLoading ? <LoadingBlock label="상품 데이터를 불러오는 중..." /> : null}
        {productsQuery.isError ? <ErrorBlock message="상품 데이터를 불러오지 못했습니다." /> : null}
        {productsQuery.data ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>이미지</th>
                  <th>식품명</th>
                  <th>카테고리</th>
                  <th>점수</th>
                  <th>가격</th>
                  <th>쿠팡</th>
                  <th>제조사</th>
                </tr>
              </thead>
              <tbody>
                {productsQuery.data.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img src={item.imageUrl} alt={item.name} className="admin-thumb" />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.score}</td>
                    <td>{formatWon(item.priceWon)}</td>
                    <td>{item.hasCoupang ? '연동' : '미연동'}</td>
                    <td>{item.manufacturer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Typography as="p" variant="label" weight="regular" color="#7b7b7b">
              총 {productsQuery.data.total}개 중 {productsQuery.data.items.length}개 표시
            </Typography>
          </div>
        ) : null}
      </section>
    </section>
  )
}
