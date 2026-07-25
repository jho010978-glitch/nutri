import type {
  AdminDashboard,
  DailyCoupangStat,
  DailySearchStat,
  DailyViewStat,
  DateRange,
  PopularKeyword,
  RetentionCohort,
} from '../../types/admin'

export interface AdminDataProvider {
  getDashboard: () => Promise<AdminDashboard>
  getViewStats: (range: DateRange) => Promise<DailyViewStat[]>
  getSearchStats: (range: DateRange) => Promise<DailySearchStat[]>
  getCoupangStats: (range: DateRange) => Promise<DailyCoupangStat[]>
  getRetention: () => Promise<RetentionCohort[]>
  getPopularKeywords: () => Promise<PopularKeyword[]>
}
