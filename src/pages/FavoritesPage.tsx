import { useFavorites } from '../contexts/FavoritesContext'
import { useLikesQuery } from '../queries/likesQueries'
import type { Product } from '../types/product'
import './FavoritesPage.css'

type FavoritesPageProps = {
  onBack: () => void
  onProductClick?: (product: Product) => void
}

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15.7 5.3a1 1 0 0 1 0 1.4L10.41 12l5.3 5.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.42 0Z" fill="#111"/>
  </svg>
)

export const FavoritesPage = ({ onBack, onProductClick }: FavoritesPageProps) => {
  const { toggle } = useFavorites()
  const { data, isLoading } = useLikesQuery(true)
  const items = data?.items ?? []

  return (
    <div className="fav-page">
      <header className="fav-header">
        <button type="button" className="fav-icon-btn" aria-label="뒤로가기" onClick={onBack}>
          <ArrowLeftIcon />
        </button>
        <h2 className="fav-title">즐겨찾기</h2>
        <div className="fav-icon-btn" aria-hidden="true" />
      </header>

      {isLoading && (
        <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>불러오는 중...</p>
      )}

      {!isLoading && items.length === 0 && (
        <div className="fav-empty">
          <p>즐겨찾기한 상품이 없어요</p>
          <p className="fav-empty-sub">상품 카드의 ♡를 눌러 저장해 보세요</p>
        </div>
      )}

      {items.length > 0 && (
        <section className="fav-grid" aria-label="즐겨찾기 상품">
          {items.map(item => {
            const product: Product = {
              id: item.product_id,
              name: item.name,
              brand: item.brand,
              image: item.image_url,
              nutritionScore: item.nutrition_score,
              category: { id: 0, name: '' },
              favorited: true,
            }
            return (
              <article key={item.product_id} className="home-card" onClick={() => onProductClick?.(product)}>
                <div className="home-card-img-wrap">
                  {item.image_url
                    ? <img className="home-card-img" src={item.image_url} alt={item.name} loading="lazy" />
                    : <div className="home-card-img home-card-img--placeholder" />
                  }
                  <span className="home-card-grade">{item.nutrition_score}</span>
                </div>
                <div className="home-card-bottom">
                  <div className="home-card-text">
                    <p className="home-card-brand">{item.brand?.name ?? '-'}</p>
                    <p className="home-card-name">{item.name}</p>
                  </div>
                  <button
                    type="button"
                    className="home-card-heart on"
                    aria-label="즐겨찾기 해제"
                    onClick={e => { e.stopPropagation(); toggle(item.product_id) }}
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
