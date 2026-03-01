import type { MyPageData } from '../types/mypage'
import productImage from '../assets/images/product.png'

export const mockMyPageData: MyPageData = {
  member: {
    name: '홍길동',
    birthDate: '2000.03.12',
    phone: '010-1234-5678',
  },
  savedProducts: [
    { id: 'saved-1', name: '찜 상품 1', imageUrl: productImage },
    { id: 'saved-2', name: '찜 상품 2', imageUrl: productImage },
    { id: 'saved-3', name: '찜 상품 3', imageUrl: productImage },
    { id: 'saved-4', name: '찜 상품 4', imageUrl: productImage },
  ],
}
