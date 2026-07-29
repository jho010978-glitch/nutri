import { Suspense, lazy } from 'react'
import { LoginPage } from '../../pages/LoginPage'
import { AdminChunkBoundary } from './AdminChunkBoundary'
import './AdminRoute.css'

// 관리자 대시보드는 차트 라이브러리를 포함해 무거우므로 일반 사용자 번들에서 분리한다.
// 접근 통제 목적이 아니다 — 실제 방어선은 서버의 ADMIN 토큰 검증이다.
const AdminDashboardPage = lazy(() =>
  import('../../pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
)

type AdminRouteProps = {
  isAdmin: boolean
  sessionChecking: boolean
  onLogin: () => void
}

// 세션 확인이 끝난 뒤 판정 — 확인 중에는 null(AppShell 스플래시가 덮음).
// 비관리자(비로그인 포함)는 로그인 화면 표시(리다이렉트 없음).
export function AdminRoute({ isAdmin, sessionChecking, onLogin }: AdminRouteProps) {
  if (sessionChecking) return null
  if (!isAdmin) return <LoginPage onLogin={onLogin} />
  return (
    <AdminChunkBoundary>
      <Suspense fallback={null}>
        <AdminDashboardPage />
      </Suspense>
    </AdminChunkBoundary>
  )
}
