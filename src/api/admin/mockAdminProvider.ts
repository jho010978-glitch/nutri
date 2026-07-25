import { compactToIso, expandRange, toYyyyMmDd } from '../../lib/dateRange'
import type {
  DailyCoupangStat,
  DailySearchStat,
  DailyViewStat,
  PopularKeyword,
  RetentionCohort,
} from '../../types/admin'
import type { AdminDataProvider } from './provider'

const MOCK_DELAY_MS = 250

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 날짜 문자열 기반 결정적 의사난수 — 같은 날짜는 항상 같은 값 (새로고침해도 데이터가 튀지 않게)
const seeded = (dateKey: string, salt: number) => {
  let h = salt
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) | 0
  h = Math.imul(h ^ (h >>> 15), 2246822507)
  h = Math.imul(h ^ (h >>> 13), 3266489909)
  return ((h ^= h >>> 16) >>> 0) / 4294967296
}

const toIsoDate = (d: Date) => compactToIso(toYyyyMmDd(d))

export const mockAdminProvider: AdminDataProvider = {
  getDashboard: async () => {
    await wait(MOCK_DELAY_MS)
    return {
      totalProducts: 1284,
      totalCategories: { depth1: 6, depth2: 24, depth3: 96 },
      avgNutritionScore: 62.4,
      lastUpdatedAt: '2026-07-25T06:00:00',
      coupangLinkStatus: { total: 1284, linked: 1052, unlinked: 187, failed: 45 },
    }
  },

  getViewStats: async (range) => {
    await wait(MOCK_DELAY_MS)
    return expandRange(range).map<DailyViewStat>((d) => {
      const key = toIsoDate(d)
      const weekend = d.getDay() === 0 || d.getDay() === 6 ? 0.7 : 1
      const viewCount = Math.round((450 + seeded(key, 1) * 400) * weekend)
      return { date: key, viewCount, uniqueProductCount: Math.round(viewCount * (0.35 + seeded(key, 2) * 0.15)) }
    })
  },

  getSearchStats: async (range) => {
    await wait(MOCK_DELAY_MS)
    return expandRange(range).map<DailySearchStat>((d) => {
      const key = toIsoDate(d)
      const weekend = d.getDay() === 0 || d.getDay() === 6 ? 0.75 : 1
      const searchCount = Math.round((180 + seeded(key, 3) * 220) * weekend)
      return { date: key, searchCount, uniqueKeywordCount: Math.round(searchCount * (0.4 + seeded(key, 4) * 0.2)) }
    })
  },

  getCoupangStats: async (range) => {
    await wait(MOCK_DELAY_MS)
    return expandRange(range).map<DailyCoupangStat>((d) => {
      const key = toIsoDate(d)
      const click = Math.round(60 + seeded(key, 5) * 90)
      const orderCount = Math.round(click * (0.06 + seeded(key, 6) * 0.06))
      const cancelCount = Math.round(orderCount * seeded(key, 7) * 0.2)
      const gmv = Math.round(orderCount * (18000 + seeded(key, 8) * 22000))
      return { date: key, click, orderCount, cancelCount, gmv, commission: Math.round(gmv * 0.03) }
    })
  },

  getRetention: async () => {
    await wait(MOCK_DELAY_MS)
    const rows: RetentionCohort[] = [
      { cohort: 'warm', w1Users: 142, retainedUsers: 31, retentionRate: 0.218, verdict: 'PASS' },
      { cohort: 'cold', w1Users: 87, retainedUsers: 9, retentionRate: 0.103, verdict: 'S4' },
    ]
    return rows
  },

  getPopularKeywords: async () => {
    await wait(MOCK_DELAY_MS)
    const rows: PopularKeyword[] = [
      { rank: 1, keyword: '단백질', previousRank: 3, change: 'UP', rankDelta: 2 },
      { rank: 2, keyword: '프로틴바', previousRank: 1, change: 'DOWN', rankDelta: -1 },
      { rank: 3, keyword: '닭가슴살', previousRank: 2, change: 'DOWN', rankDelta: -1 },
      { rank: 4, keyword: '그릭요거트', previousRank: 4, change: 'SAME', rankDelta: 0 },
      { rank: 5, keyword: '저당 시리얼', previousRank: null, change: 'NEW', rankDelta: 0 },
      { rank: 6, keyword: '오트밀', previousRank: 5, change: 'DOWN', rankDelta: -1 },
      { rank: 7, keyword: '식이섬유', previousRank: 9, change: 'UP', rankDelta: 2 },
      { rank: 8, keyword: '무가당 두유', previousRank: 6, change: 'DOWN', rankDelta: -2 },
      { rank: 9, keyword: '샐러드', previousRank: 8, change: 'DOWN', rankDelta: -1 },
      { rank: 10, keyword: '곤약젤리', previousRank: null, change: 'NEW', rankDelta: 0 },
    ]
    return rows
  },
}
