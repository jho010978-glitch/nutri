import { useQuery } from '@tanstack/react-query'
import { adminDataProvider } from '../api/admin/client'
import { rangeDayCount } from '../lib/dateRange'
import type { DateRange } from '../types/admin'

const AUTO_REFRESH_MS = 60_000
const COUPANG_MAX_DAYS = 30

export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  views: (r: DateRange) => [...adminKeys.all, 'views', r.start, r.end] as const,
  searches: (r: DateRange) => [...adminKeys.all, 'searches', r.start, r.end] as const,
  coupang: (r: DateRange) => [...adminKeys.all, 'coupang', r.start, r.end] as const,
  retention: () => [...adminKeys.all, 'retention'] as const,
  popularKeywords: () => [...adminKeys.all, 'popular-keywords'] as const,
}

// autoRefresh 시 60초 주기 재조회 — 탭이 백그라운드면 react-query 기본값(refetchIntervalInBackground: false)이 폴링을 멈춘다
type AdminQueryOptions = { autoRefresh?: boolean; enabled?: boolean }

const shared = (opts?: AdminQueryOptions) => ({
  refetchInterval: opts?.autoRefresh ? AUTO_REFRESH_MS : undefined,
  enabled: opts?.enabled,
  staleTime: AUTO_REFRESH_MS,
})

export const useAdminDashboardQuery = (opts?: AdminQueryOptions) =>
  useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminDataProvider.getDashboard(),
    ...shared(opts),
  })

export const useViewStatsQuery = (range: DateRange, opts?: AdminQueryOptions) =>
  useQuery({
    queryKey: adminKeys.views(range),
    queryFn: () => adminDataProvider.getViewStats(range),
    ...shared(opts),
  })

export const useSearchStatsQuery = (range: DateRange, opts?: AdminQueryOptions) =>
  useQuery({
    queryKey: adminKeys.searches(range),
    queryFn: () => adminDataProvider.getSearchStats(range),
    ...shared(opts),
  })

// 쿠팡 통계는 최대 30일 — 초과 기간은 호출 자체를 막고 위젯이 안내를 표시한다.
// 0일(역순 범위)도 조회 대상이 아니다
export const isCoupangRangeAllowed = (range: DateRange) => {
  const days = rangeDayCount(range)
  return days >= 1 && days <= COUPANG_MAX_DAYS
}

export const useCoupangStatsQuery = (range: DateRange, opts?: AdminQueryOptions) => {
  const base = shared(opts)
  return useQuery({
    queryKey: adminKeys.coupang(range),
    queryFn: () => adminDataProvider.getCoupangStats(range),
    ...base,
    enabled: (base.enabled ?? true) && isCoupangRangeAllowed(range),
  })
}

export const useRetentionQuery = (opts?: AdminQueryOptions) =>
  useQuery({
    queryKey: adminKeys.retention(),
    queryFn: () => adminDataProvider.getRetention(),
    ...shared(opts),
  })

export const usePopularKeywordsQuery = (opts?: AdminQueryOptions) =>
  useQuery({
    queryKey: adminKeys.popularKeywords(),
    queryFn: () => adminDataProvider.getPopularKeywords(),
    ...shared(opts),
  })
