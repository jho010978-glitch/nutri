import type { BrandRef, CategoryRef } from '../api/products/types'

export type Product = {
  id: number
  name: string
  brand: BrandRef
  image: string
  nutritionScore: number
  category: CategoryRef
  favorited: boolean
}
