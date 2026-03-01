export type ProductResponse = {
  id: number
  name: string
  brand: string
  price: number
  imageUrl: string
  categoryName: string
  score: number
  grade: string
  coupangLink: string
}

export type ProductDetailResponse = ProductResponse & {
  servingSize: number
  servingUnit: string
  calories: number
  sodium: number
  carbohydrates: number
  sugars: number
  fat: number
  transFat: number
  saturatedFat: number
  cholesterol: number
  protein: number
}

export type PageResponse<T> = {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  sort: string
  last: boolean
}

export type ProductSearchCondition = {
  keyword?: string
  categories?: string[]
  grades?: string[]
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  minScore?: number
  maxScore?: number
  minCalories?: number
  maxCalories?: number
  minCarbohydrates?: number
  maxCarbohydrates?: number
  minSugars?: number
  maxSugars?: number
  minProtein?: number
  maxProtein?: number
  minFat?: number
  maxFat?: number
  minSaturatedFat?: number
  maxSaturatedFat?: number
  minTransFat?: number
  maxTransFat?: number
  minCholesterol?: number
  maxCholesterol?: number
  minSodium?: number
  maxSodium?: number
}

export type BrandCountResponse = {
  brand: string
  count: number
}

export type CategoryResponse = {
  code: string
  name: string
}
