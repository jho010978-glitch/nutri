import { httpAdminProvider } from './httpAdminProvider'
import type { AdminDataProvider } from './provider'

// 관리자 계정(role=ADMIN) 준비 전까지 mock 사용 — 준비되면 httpAdminProvider로 교체
export const adminDataProvider: AdminDataProvider = httpAdminProvider
