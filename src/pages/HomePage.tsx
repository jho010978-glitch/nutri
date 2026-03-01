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

function mapToProduct(p: ProductResponse): Product {
  return {
    id: p.id,
    name: p.name,
    image: p.imageUrl ?? '',
    price: p.price != null ? `${p.price.toLocaleString('ko-KR')}원` : '-',
    protein: '-',
    calories: '-',
    fat: '-',
    carbs: '-',
    grade: p.grade ?? '-',
    score: p.score ?? 0,
  }
}

export const HomePage = ({ onMoveToFilter, onMoveToMyPage, onProductClick, onAddToCompare }: HomePageProps) => {
  const { data, isLoading, isError } = useProductListQuery()
  const products = data?.content ?? []

  return (
    <>
      <header className="top-area">
        <h2>영양대학</h2>
        <button className="icon-btn" type="button" aria-label="마이페이지" onClick={onMoveToMyPage}>
          <UserIcon />
        </button>
      </header>

      <div className="search-area">
        <input type="text" placeholder="검색" aria-label="상품 검색" />
      </div>

      <div className="sort-row">
        <span>인기많은순</span>
        <button className="icon-btn" type="button" aria-label="필터" onClick={onMoveToFilter}>
          <FilterIcon />
        </button>
      </div>

      {isLoading && (
        <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>불러오는 중...</p>
      )}
      {isError && (
        <p style={{ textAlign: 'center', color: '#b42318', padding: '2rem' }}>상품을 불러오지 못했습니다.</p>
      )}

      <section className="product-list" aria-label="상품 목록">
        {products.map((item) => {
          const product = mapToProduct(item)
          return (
            <article
              className="product-card"
              key={item.id}
              onClick={() => onProductClick?.(product)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-top">
                <img className="product-thumb" src={item.imageUrl} alt={item.name} />

                <div className="product-main">
                  <div className="title-row">
                    <h3>{item.name}</h3>
                    <span className="grade-pill">{item.grade}</span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#888', margin: '2px 0' }}>
                    {item.brand} · {item.categoryName}
                  </p>

                  <p className="price">
                    {item.price != null ? `${item.price.toLocaleString('ko-KR')}원` : '-'}
                  </p>

                  <div className="btn-row">
                    {item.coupangLink ? (
                      <a
                        href={item.coupangLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="buy-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        구매하러가기
                      </a>
                    ) : (
                      <button type="button" className="buy-btn" disabled>
                        구매하러가기
                      </button>
                    )}
                    <button
                      type="button"
                      className="compare-btn"
                      onClick={(e) => { e.stopPropagation(); onAddToCompare?.(product) }}
                    >
                      비교하기
                    </button>
                  </div>
                </div>
              </div>

              <dl className="nutrition-row">
                <div>
                  <dt>점수</dt>
                  <dd>{item.score}점</dd>
                </div>
                <div>
                  <dt>등급</dt>
                  <dd className="protein">{item.grade}</dd>
                </div>
                <div>
                  <dt>카테고리</dt>
                  <dd>{item.categoryName}</dd>
                </div>
                <div>
                  <dt>브랜드</dt>
                  <dd>{item.brand}</dd>
                </div>
              </dl>
            </article>
          )
        })}
      </section>
    </>
  )
}
