import type {
  AdminClickStats,
  AdminDashboard,
  AdminProductListResponse,
  AdminSearchStats,
} from '../../types/admin'

export type GetProductsParams = {
  query?: string
  limit?: number
}

export interface AdminDataProvider {
  getDashboard: () => Promise<AdminDashboard>
  getClickStats: () => Promise<AdminClickStats>
  getSearchStats: () => Promise<AdminSearchStats>
  getProducts: (params?: GetProductsParams) => Promise<AdminProductListResponse>
}

