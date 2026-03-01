export type AdminSummary = {
  totalProducts: number
  totalCategories: number
  averageScore: number
  lastUpdatedAt: string
}

export type IntegrationStatus = {
  total: number
  withImage: number
  linkedToCoupang: number
  missingCount: number
}

export type ApiLimitStatus = {
  key: string
  label: string
  used: number
  limit: number
  resetInSeconds: number
}

export type AdminDashboard = {
  summary: AdminSummary
  integration: IntegrationStatus
  apiLimits: ApiLimitStatus[]
}

export type RankedItem = {
  id: string
  label: string
  count: number
}

export type AdminClickStats = {
  updatedAt: string
  totalClicks: number
  coupangClicks: number
  otherClicks: number
  topItems: RankedItem[]
}

export type AdminSearchStats = {
  totalSearches: number
  topKeywords: RankedItem[]
}

export type AdminProduct = {
  id: string
  imageUrl: string
  name: string
  category: string
  score: number
  priceWon: number
  hasCoupang: boolean
  manufacturer: string
}

export type AdminProductListResponse = {
  items: AdminProduct[]
  total: number
}

