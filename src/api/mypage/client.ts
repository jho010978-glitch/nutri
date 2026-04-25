import { apiFetch } from '../client'
import type { MyMemberProfile } from '../../types/mypage'

export async function getMe(): Promise<MyMemberProfile> {
  return apiFetch<MyMemberProfile>('/users/me')
}
