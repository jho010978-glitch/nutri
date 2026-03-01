import type { MyPageData } from '../../types/mypage'

export interface MyPageDataProvider {
  getMyPage: () => Promise<MyPageData>
}
