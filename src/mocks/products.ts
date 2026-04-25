import type { Product } from '../types/product'

export const products: Product[] = [
  { id: 1, name: '하림 수비드 닭가슴살', brand: { id: 1, name: '하림' }, image: '', nutritionScore: 82, category: { id: 1, name: '육류, 어류' }, favorited: false },
  { id: 2, name: '한끼통살',             brand: { id: 2, name: '한끼' }, image: '', nutritionScore: 73, category: { id: 1, name: '육류, 어류' }, favorited: false },
  { id: 3, name: '하림 닭가슴살',        brand: { id: 1, name: '하림' }, image: '', nutritionScore: 80, category: { id: 1, name: '육류, 어류' }, favorited: false },
]
