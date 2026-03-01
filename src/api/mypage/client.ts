import { mockMyPageProvider } from './mockMyPageProvider'
import type { MyPageDataProvider } from './provider'

// Swap this binding to an Orval-backed provider when API is ready.
export const myPageDataProvider: MyPageDataProvider = mockMyPageProvider
