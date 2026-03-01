import { mockAdminProvider } from './mockAdminProvider'
import type { AdminDataProvider } from './provider'

// Swap this binding to an Orval-backed provider when API is ready.
export const adminDataProvider: AdminDataProvider = mockAdminProvider

