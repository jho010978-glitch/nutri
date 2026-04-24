import { useState } from 'react'
import { useFavorites } from '../contexts/FavoritesContext'
import { FilterIcon, UserIcon } from '../components/icons'
import { useProductListQuery } from '../queries/productQueries'
import type { ProductResponse } from '../api/products/types'
import type { Product } from '../types/product'

type HomePageProps = {
  onMoveToFilter: () => void
  onMoveToMyPage: () => void
  onProductClick?: (product: Product) => void
  onAddToCompare?: (product: Product) => void
}

const CATEGORIES = [
  { id: 'salad',   label: '샐러드',  emoji: '🥗' },
  { id: 'chicken', label: '닭가슴살', emoji: '🍗' },
  { id: 'soy',     label: '두유',    emoji: '🫛' },
  { id: 'konjac',  label: '곤약',    emoji: '🍢' },
]

const FILTER_CHIPS = ['추천순', '브랜드', '성분']

function mapToProduct(p: ProductResponse): Product {
  return {
    id: p.id,
    name: p.name,
    image: p.imageUrl ?? '',
    price: p.price != null ? `${p.price.toLocaleString('ko-KR')}원` : '-',
    protein: '-', calories: '-', fat: '-', carbs: '-',
    grade: p.grade ?? '-',
    score: p.score ?? 0,
  }
}

export const HomePage = ({ onMoveToFilter, onMoveToMyPage, onProductClick }: HomePageProps) => {
  const { data, isLoading, isError } = useProductListQuery()
  const products = data?.content ?? []
  const [activeCat, setActiveCat] = useState(0)
  const { toggle, isFavorite } = useFavorites()

  return (
    <div className="home-page">
      <header className="home-header">
        <button className="icon-btn" type="button" aria-label="마이페이지" onClick={onMoveToMyPage}>
          <UserIcon />
        </button>
      </header>

      <div className="home-search">
        <svg className="home-search-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M10 2a8 8 0 1 1-5.3 14L1 19.7 2.3 21l3.7-3.7A8 8 0 0 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" fill="#9a9a9a"/>
        </svg>
        <input type="text" placeholder="검색" aria-label="상품 검색" />
      </div>

      <div className="home-cats-wrap">
        <div className="home-cats" role="list" aria-label="카테고리">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={`home-cat${i === activeCat ? ' home-cat--on' : ''}`}
              role="listitem"
              onClick={() => setActiveCat(i)}
            >
              <span className="home-cat-emoji" aria-hidden="true">{c.emoji}</span>
              <span className="home-cat-label">{c.label}</span>
            </button>
          ))}
        </div>
        <div className="home-cat-dots" aria-hidden="true">
          {CATEGORIES.map((_, i) => (
            <span key={i} className={`home-cat-dot${i === activeCat ? ' home-cat-dot--on' : ''}`} />
          ))}
        </div>
      </div>

      <div className="home-chips">
        <button className="home-chip-icon" type="button" aria-label="필터" onClick={onMoveToFilter}>
          <FilterIcon />
        </button>
        {FILTER_CHIPS.map(label => (
          <button key={label} type="button" className="home-chip">
            {label} <span aria-hidden="true">▾</span>
          </button>
        ))}
      </div>

      <div className="home-divider" />

      {isLoading && <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>불러오는 중...</p>}
      {isError && <p style={{ textAlign: 'center', color: '#b42318', padding: '2rem' }}>상품을 불러오지 못했습니다.</p>}

      <section className="home-grid" aria-label="상품 목록">
        {products.map(item => {
          const product = mapToProduct(item)
          const faved = isFavorite(item.id)
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
                  <p className="home-card-per">
                    {item.price != null ? `100g당 ${item.price.toLocaleString('ko-KR')}원` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  className={`home-card-heart${faved ? ' on' : ''}`}
                  aria-label={faved ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                  onClick={e => { e.stopPropagation(); toggle(item.id) }}
                >
                  {faved ? '♥' : '♡'}
                </button>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
