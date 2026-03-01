import type {
  BrandCountResponse,
  PageResponse,
  ProductDetailResponse,
  ProductResponse,
  ProductSearchCondition,
} from './types'

function buildConditionParams(condition: ProductSearchCondition): URLSearchParams {
  const params = new URLSearchParams()
  if (condition.keyword) params.set('keyword', condition.keyword)
  if (condition.minPrice != null) params.set('minPrice', String(condition.minPrice))
  if (condition.maxPrice != null) params.set('maxPrice', String(condition.maxPrice))
  if (condition.minScore != null) params.set('minScore', String(condition.minScore))
  if (condition.maxScore != null) params.set('maxScore', String(condition.maxScore))
  if (condition.minCalories != null) params.set('minCalories', String(condition.minCalories))
  if (condition.maxCalories != null) params.set('maxCalories', String(condition.maxCalories))
  if (condition.minCarbohydrates != null) params.set('minCarbohydrates', String(condition.minCarbohydrates))
  if (condition.maxCarbohydrates != null) params.set('maxCarbohydrates', String(condition.maxCarbohydrates))
  if (condition.minSugars != null) params.set('minSugars', String(condition.minSugars))
  if (condition.maxSugars != null) params.set('maxSugars', String(condition.maxSugars))
  if (condition.minProtein != null) params.set('minProtein', String(condition.minProtein))
  if (condition.maxProtein != null) params.set('maxProtein', String(condition.maxProtein))
  if (condition.minFat != null) params.set('minFat', String(condition.minFat))
  if (condition.maxFat != null) params.set('maxFat', String(condition.maxFat))
  if (condition.minSaturatedFat != null) params.set('minSaturatedFat', String(condition.minSaturatedFat))
  if (condition.maxSaturatedFat != null) params.set('maxSaturatedFat', String(condition.maxSaturatedFat))
  if (condition.minTransFat != null) params.set('minTransFat', String(condition.minTransFat))
  if (condition.maxTransFat != null) params.set('maxTransFat', String(condition.maxTransFat))
  if (condition.minCholesterol != null) params.set('minCholesterol', String(condition.minCholesterol))
  if (condition.maxCholesterol != null) params.set('maxCholesterol', String(condition.maxCholesterol))
  if (condition.minSodium != null) params.set('minSodium', String(condition.minSodium))
  if (condition.maxSodium != null) params.set('maxSodium', String(condition.maxSodium))
  condition.categories?.forEach((c) => params.append('categories', c))
  condition.grades?.forEach((g) => params.append('grades', g))
  condition.brands?.forEach((b) => params.append('brands', b))
  return params
}

async function parseResponse<T>(res: Response): Promise<T> {
  const json = await res.json()
  if (!res.ok || !json.isSuccess) {
    throw new Error(json.data?.message ?? `HTTP ${res.status}`)
  }
  return json.data as T
}

export async function searchProducts(
  condition: ProductSearchCondition,
): Promise<PageResponse<ProductResponse>> {
  const params = buildConditionParams(condition)
  const res = await fetch(`/api/products?${params}`)
  return parseResponse(res)
}

export async function getProductDetail(id: number): Promise<ProductDetailResponse> {
  const res = await fetch(`/api/products/${id}`)
  return parseResponse(res)
}

export async function compareProducts(ids: number[]): Promise<ProductDetailResponse[]> {
  const params = new URLSearchParams()
  ids.forEach((id) => params.append('ids', String(id)))
  const res = await fetch(`/api/products/compare?${params}`)
  return parseResponse(res)
}

export async function getBrandCounts(
  condition: ProductSearchCondition,
): Promise<BrandCountResponse[]> {
  const params = buildConditionParams(condition)
  const res = await fetch(`/api/products/brand-counts?${params}`)
  return parseResponse(res)
}
