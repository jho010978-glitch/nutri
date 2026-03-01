import { useQuery } from '@tanstack/react-query'
import { adminDataProvider } from '../api/admin/client'

const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  clickStats: () => [...adminKeys.all, 'click-stats'] as const,
  searchStats: () => [...adminKeys.all, 'search-stats'] as const,
  products: (query: string) => [...adminKeys.all, 'products', query] as const,
}

export const useDashboardQuery = () =>
  useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminDataProvider.getDashboard(),
  })

export const useClickStatsQuery = () =>
  useQuery({
    queryKey: adminKeys.clickStats(),
    queryFn: () => adminDataProvider.getClickStats(),
  })

export const useSearchStatsQuery = () =>
  useQuery({
    queryKey: adminKeys.searchStats(),
    queryFn: () => adminDataProvider.getSearchStats(),
  })

export const useProductsQuery = (query: string) =>
  useQuery({
    queryKey: adminKeys.products(query),
    queryFn: () => adminDataProvider.getProducts({ query, limit: 10 }),
  })

