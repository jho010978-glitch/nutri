import { apiFetch } from '../client'
import type {
  AdminDashboard,
  DailyCoupangStat,
  DailySearchStat,
  DailyViewStat,
  DateRange,
  PopularKeyword,
  RetentionCohort,
} from '../../types/admin'
import type { AdminDataProvider } from './provider'

// 파라미터명은 swagger 기준 camelCase (명세 문서의 start_date와 다름), 값 형식은 yyyyMMdd
const rangeQuery = ({ start, end }: DateRange) =>
  new URLSearchParams({ startDate: start, endDate: end }).toString()

export const httpAdminProvider: AdminDataProvider = {
  getDashboard: () => apiFetch<AdminDashboard>('/admin/dashboard'),
  getViewStats: (range) => apiFetch<DailyViewStat[]>(`/admin/stats/views?${rangeQuery(range)}`),
  getSearchStats: (range) => apiFetch<DailySearchStat[]>(`/admin/stats/searches?${rangeQuery(range)}`),
  getCoupangStats: (range) => apiFetch<DailyCoupangStat[]>(`/admin/stats/coupang?${rangeQuery(range)}`),
  getRetention: () => apiFetch<RetentionCohort[]>('/admin/stats/retention'),
  getPopularKeywords: () => apiFetch<PopularKeyword[]>('/search/keywords/popular'),
}
