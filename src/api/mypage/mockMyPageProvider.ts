import { mockMyPageData } from '../../mocks/myPageData'
import type { MyPageDataProvider } from './provider'

const MOCK_DELAY_MS = 250

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockMyPageProvider: MyPageDataProvider = {
  getMyPage: async () => {
    await wait(MOCK_DELAY_MS)
    return mockMyPageData
  },
}
