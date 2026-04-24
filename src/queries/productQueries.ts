import { useQuery } from '@tanstack/react-query'
import { searchProducts, getProductDetail } from '../api/products/api'
import type { ProductSearchCondition } from '../api/products/types'

const productKeys = {
  all: ['products'] as const,
  list: (condition: ProductSearchCondition) => [...productKeys.all, 'list', condition] as const,
  detail: (id: number) => [...productKeys.all, 'detail', id] as const,
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
