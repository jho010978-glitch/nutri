import { apiFetch } from './client'
import type { BrandRef } from './products/types'

export type LikeItem = {
  product_id: number
  name: string
  image_url: string
  nutrition_score: number
  brand: BrandRef
}

export type LikesResponse = {
  total: number
  items: LikeItem[]
}

export async function getLikes(page = 1, size = 20): Promise<LikesResponse> {
  return apiFetch<LikesResponse>(`/likes?page=${page}&size=${size}`)
}

export async function addLike(productId: number): Promise<void> {
  await apiFetch<void>(`/likes/${productId}`, { method: 'POST' })
}

export async function removeLike(productId: number): Promise<void> {
  await apiFetch<void>(`/likes/${productId}`, { method: 'DELETE' })
}
