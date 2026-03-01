import { useQuery } from '@tanstack/react-query'
import { searchProducts, getProductDetail, compareProducts, getBrandCounts } from '../api/products/api'
import type { ProductSearchCondition } from '../api/products/types'

const productKeys = {
  all: ['products'] as const,
  list: (condition: ProductSearchCondition) => [...productKeys.all, 'list', condition] as const,
  detail: (id: number) => [...productKeys.all, 'detail', id] as const,
  compare: (ids: number[]) => [...productKeys.all, 'compare', ids] as const,
  brandCounts: (condition: ProductSearchCondition) =>
    [...productKeys.all, 'brand-counts', condition] as const,
}

export const useProductListQuery = (condition: ProductSearchCondition = {}) =>
  useQuery({
    queryKey: productKeys.list(condition),
    queryFn: () => searchProducts(condition),
  })

export const useProductDetailQuery = (id: number) =>
  useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductDetail(id),
    enabled: id > 0,
  })

export const useCompareProductsQuery = (ids: number[]) =>
  useQuery({
    queryKey: productKeys.compare(ids),
    queryFn: () => compareProducts(ids),
    enabled: ids.length > 0,
  })

export const useBrandCountsQuery = (condition: ProductSearchCondition) =>
  useQuery({
    queryKey: productKeys.brandCounts(condition),
    queryFn: () => getBrandCounts(condition),
  })
