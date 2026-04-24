// ── 상품 목록 아이템 ─────────────────────────────────────────────
export type ProductResponse = {
  id: number
  name: string
  brand: string
  imageUrl: string
  nutritionScore: number
  category: string
  isFavorited: boolean
}

// ── 영양소 (상세) ────────────────────────────────────────────────
export type NutrientsResponse = {
  servingSize: number
  calories: number
  carbohydrate: number
  sugar: number
  protein: number
  fat: number
  saturatedFat: number
  transFat: number
  cholesterol: number
  sodium: number
}

// ── 쿠팡 연동 정보 (상세) ─────────────────────────────────────────
export type CoupangInfo = {
  affiliateUrl: string
  landingUrl: string
  price: number
  isRocket: boolean
  isFreeShipping: boolean
  lastSyncedAt: string
}

// ── 상품 상세 ────────────────────────────────────────────────────
export type ProductDetailResponse = {
  id: number
  name: string
  brand: string
  imageUrl: string
  nutritionScore: number
  category: string
  nutrients: NutrientsResponse
  scoreRankPercent: number
  coupang: CoupangInfo | null
  isFavorited: boolean
  viewCount: number
}

// ── 페이지 응답 래퍼 ─────────────────────────────────────────────
export type PageResponse<T> = {
  total: number
  page: number
  size: number
  items: T[]
}

// ── 검색 조건 ────────────────────────────────────────────────────
export type SortType = 'POPULAR' | 'SCORE' | 'ACCURACY' | 'RECOMMENDED'

export type ProductSearchCondition = {
  keyword?: string
  categoryId?: number
  brandId?: number
  minCalories?: number
  maxCalories?: number
  minProtein?: number
  maxProtein?: number
  minFat?: number
  maxFat?: number
  minCarbohydrate?: number
  maxCarbohydrate?: number
  minSugar?: number
  maxSugar?: number
  minSodium?: number
  maxSodium?: number
  minNutritionScore?: number
  maxNutritionScore?: number
  sort?: SortType
  page?: number
  size?: number
}

// ── 카테고리 (트리) ──────────────────────────────────────────────
export type CategoryResponse = {
  id: number
  name: string
  depth: number
  children?: CategoryResponse[]
}

// ── 브랜드 ──────────────────────────────────────────────────────
export type BrandResponse = {
  id: number
  name: string
  productCount: number
}
