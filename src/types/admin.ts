// 관리자 로깅·분석 대시보드 — swagger(/v3/api-docs) 실제 응답 스키마 기준
export type AdminDashboard = {
  totalProducts: number
  totalCategories: { depth1: number; depth2: number; depth3: number }
  avgNutritionScore: number
  lastUpdatedAt: string
  coupangLinkStatus: { total: number; linked: number; unlinked: number; failed: number }
}

export type DailyViewStat = {
  date: string
  viewCount: number
  uniqueProductCount: number
}

export type DailySearchStat = {
  date: string
  searchCount: number
  uniqueKeywordCount: number
}

export type DailyCoupangStat = {
  date: string
  click: number
  orderCount: number
  cancelCount: number
  gmv: number
  commission: number
}

export type RetentionVerdict = 'PASS' | 'FAIL' | 'S4'

export type RetentionCohort = {
  cohort: string
  w1Users: number
  retainedUsers: number
  retentionRate: number
  verdict: RetentionVerdict
}

export type KeywordChange = 'UP' | 'DOWN' | 'SAME' | 'NEW'

export type PopularKeyword = {
  rank: number
  keyword: string
  previousRank: number | null
  change: KeywordChange
  rankDelta: number
}

// 기간 필터 — start/end는 yyyyMMdd (명세 6장 공통 정책)
export type DateRange = { start: string; end: string }
export type PeriodPreset = 'today' | '7d' | '30d' | 'custom'
