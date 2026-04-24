import { useFavorites } from '../contexts/FavoritesContext'
import { useProductListQuery } from '../queries/productQueries'
import type { ProductResponse } from '../api/products/types'
import type { Product } from '../types/product'
import './FavoritesPage.css'

type FavoritesPageProps = {
  onBack: () => void
  onProductClick?: (product: Product) => void
}

function mapToProduct(p: ProductResponse): Product {
  return {
    id: p.id, name: p.name, image: p.imageUrl ?? '',
    price: p.price != null ? `${p.price.toLocaleString('ko-KR')}원` : '-',
    protein: '-', calories: '-', fat: '-', carbs: '-',
    grade: p.grade ?? '-', score: p.score ?? 0,
  }
}

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15.7 5.3a1 1 0 0 1 0 1.4L10.41 12l5.3 5.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.42 0Z" fill="#111"/>
  </svg>
)

export const FavoritesPage = ({ onBack, onProductClick }: FavoritesPageProps) => {
  const { data } = useProductListQuery()
  const { isFavorite, toggle } = useFavorites()
  const allProducts = data?.content ?? []
  const favorites = allProducts.filter(p => isFavorite(p.id))

  return (
    <div className="fav-page">
      <header className="fav-header">
        <button type="button" className="fav-icon-btn" aria-label="뒤로가기" onClick={onBack}>
          <ArrowLeftIcon />
        </button>
        <h2 className="fav-title">즐겨찾기</h2>
        <button type="button" className="fav-icon-btn" aria-label="검색">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 2a8 8 0 1 1-5.3 14L1 19.7 2.3 21l3.7-3.7A8 8 0 0 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" fill="#111"/>
          </svg>
        </button>
      </header>

      {favorites.length === 0 ? (
        <div className="fav-empty">
          <p>즐겨찾기한 상품이 없어요</p>
          <p className="fav-empty-sub">상품 카드의 ♡를 눌러 저장해 보세요</p>
        </div>
      ) : (
        <section className="fav-grid" aria-label="즐겨찾기 상품">
          {favorites.map(item => {
            const product = mapToProduct(item)
            return (
              <article key={item.id} className="home-card" onClick={() => onProductClick?.(product)}>
                <div className="home-card-img-wrap">
                  {item.imageUrl
                    ? <img className="home-card-img" src={item.imageUrl} alt={item.name} loading="lazy" />
                    : <div className="home-card-img home-card-img--placeholder" />
                  }
                  <span className="home-card-grade">{item.grade ?? 'A'}</span>
                </div>
                <div className="home-card-bottom">
                  <div className="home-card-text">
                    <p className="home-card-brand">{item.brand ?? '-'}</p>
                    <p className="home-card-name">{item.name}</p>
                    <p className="home-card-price">
                      {item.price != null ? `${item.price.toLocaleString('ko-KR')}원` : '-'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="home-card-heart on"
                    aria-label="즐겨찾기 해제"
                    onClick={e => { e.stopPropagation(); toggle(item.id) }}
                  >♥</button>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}
