import { mockAdminDashboard, mockAdminProducts, mockClickStats, mockSearchStats } from '../../mocks/adminData'
import type { AdminDataProvider, GetProductsParams } from './provider'

const MOCK_DELAY_MS = 250

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockAdminProvider: AdminDataProvider = {
  getDashboard: async () => {
    await wait(MOCK_DELAY_MS)
    return mockAdminDashboard
  },
  getClickStats: async () => {
    await wait(MOCK_DELAY_MS)
    return mockClickStats
  },
  getSearchStats: async () => {
    await wait(MOCK_DELAY_MS)
    return mockSearchStats
  },
  getProducts: async (params?: GetProductsParams) => {
    await wait(MOCK_DELAY_MS)
    const limit = params?.limit ?? 10
    const query = params?.query?.trim().toLowerCase()

    const filtered = query
      ? mockAdminProducts.filter((product) => {
          return (
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.manufacturer.toLowerCase().includes(query)
          )
        })
      : mockAdminProducts

    return {
      items: filtered.slice(0, limit),
      total: filtered.length,
    }
  },
}

