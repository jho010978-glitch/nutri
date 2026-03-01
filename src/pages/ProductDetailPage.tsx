import productImage from '../assets/images/product.png'
import { BackArrowIcon, ShareIcon } from '../components/icons'
import type { Product } from '../types/product'
import './ProductDetailPage.css'

type ProductDetailPageProps = {
  product: Product
  onBack: () => void
  onAddToCompare?: (product: Product) => void
}

const nutritionItems = [
  { label: '영양', value: '300', unit: 'kcal', ref: '/2000kcal', pct: 15 },
  { label: '나트륨', value: '300', unit: 'kcal', ref: '/2000kcal', pct: 15 },
  { label: '탄수화물', value: '300', unit: 'kcal', ref: '/2000kcal', pct: 15 },
  { label: '당류', value: '300', unit: 'kcal', ref: '/2000kcal', pct: 15 },
  { label: '지방', value: '300', unit: 'kcal', ref: '/2000kcal', pct: 15 },
  { label: '트랜스지방', value: '300', unit: 'kcal', ref: '/2000kcal', pct: 15 },
  { label: '포화지방', value: '300', unit: 'kcal', ref: '/2000kcal', pct: 15 },
  { label: '콜레스테롤', value: '300', unit: 'kcal', ref: '/2000kcal', pct: 15 },
  { label: '단백질', value: '300', unit: 'kcal', ref: '/2000kcal', pct: 15 },
]

const relatedProducts = [
  { id: 1, brand: '하림', name: '하림 닭가슴살 플레테피 100g 10개', price: '19,530원', priceUnit: '100g당 ₩1,953' },
  { id: 2, brand: '평상날', name: '평상날 소스통닭 닭가슴살 맛보기 18종, 30개, 100', price: '19,530원', priceUnit: '100g당 ₩1,953' },
  { id: 3, brand: '하림', name: '하림 닭가슴살 큘릭 100g 20개', price: '19,530원', priceUnit: '100g당 ₩1,953' },
]

const photoReviews = [
  { id: 1, rating: 5, text: '촉촉하고 부드러워요! 먹기 편하고 건강 샐러드에 곁들이기도 좋아요' },
  { id: 2, rating: 5, text: '촉촉하고 부드러워요! 먹기 편하고 건강 샐러드에 곁들이기도 좋아요' },
  { id: 3, rating: 5, text: '동봉된 박자재 먹기 좋고, 그냥 먹거나 샐러드에 곁들이기도 좋아요' },
  { id: 4, rating: 5, text: '동봉된 박자재 먹기 좋고, 그냥 먹거나 샐러드에 곁들이기도 좋아요' },
]

const textReviews = [
  { id: 1, text: '저염이라 건강하게 먹을 수 있고 식감도 퍽퍽하지 않아서 좋아요.' },
  { id: 2, text: '다이어트 중인데 단백질 보충용으로 딱이에요. 재구매 의사 있습니다!' },
  { id: 3, text: '맛이 담백하고 한 팩씩 포장되어 있어서 간편하게 먹기 좋아요.' },
]

export const ProductDetailPage = ({ product, onBack, onAddToCompare }: ProductDetailPageProps) => {
  const score = product.score
  const scoreDeg = score * 3.6

  return (
    <div className="detail-page">
      {/* Header */}
      <header className="detail-header">
        <button className="detail-back-btn icon-btn" type="button" aria-label="뒤로가기" onClick={onBack}>
          <BackArrowIcon />
        </button>
      </header>

      {/* Product image grid */}
      <div className="detail-image-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <img key={i} src={product.image} alt={product.name} className="detail-grid-img" />
        ))}
      </div>

      {/* Product info */}
      <div className="detail-info-block">
        <div className="detail-info-row">
          <div className="detail-info-left">
            <h1 className="detail-product-name">{product.name}</h1>
            <p className="detail-product-price">{product.price}</p>
            <div className="detail-stars">★★★★★</div>
          </div>
          <div className="detail-score-badge">{score}</div>
        </div>

        <div className="detail-action-row">
          <button type="button" className="detail-action-btn" onClick={() => onAddToCompare?.(product)}>비교하기</button>
          <button type="button" className="detail-action-btn detail-action-btn--share">
            <ShareIcon />
            공유하기
          </button>
        </div>
      </div>

      {/* Nutrition bars */}
      <section className="detail-nutrition-card">
        {nutritionItems.map((item) => (
          <div key={item.label} className="detail-nutrition-row">
            <span className="detail-nutrition-label">{item.label}</span>
            <div className="detail-nutrition-bar-wrap">
              <div className="detail-nutrition-bar" style={{ width: `${item.pct}%` }} />
            </div>
            <span className="detail-nutrition-val">{item.value}{item.unit}</span>
            <span className="detail-nutrition-ref">{item.ref}</span>
          </div>
        ))}
      </section>

      {/* Quote */}
      <p className="detail-quote">
        "국내산 닭가슴살을 저온 수비드로 조리해 촉촉하고 부드러운 식감을 살린 건강 단백질 제품"
      </p>

      {/* Coupang button */}
      <button type="button" className="detail-coupang-btn">
        쿠팡 비교하기 →
      </button>

      {/* Nutrition score */}
      <section className="detail-score-card">
        <h2 className="detail-section-title">영양점수</h2>
        <p className="detail-score-subtitle">닭가슴살 카테고리<br />총 400개 제품 중 상위 0.1%</p>

        <div className="detail-score-body">
          <div className="detail-tag-col">
            <span className="detail-tag">고단백</span>
            <span className="detail-tag">제로당</span>
            <span className="detail-tag">저지방</span>
          </div>

          <div
            className="detail-score-ring"
            style={{
              background: `conic-gradient(#ff7f83 0deg ${scoreDeg}deg, #e8e8e8 ${scoreDeg}deg 360deg)`,
            }}
          >
            <div className="detail-score-inner">
              <span className="detail-score-num">{score}점</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular products */}
      <section className="detail-related-card">
        <h2 className="detail-section-title">인기 상품</h2>
        <div className="detail-related-scroll">
          {relatedProducts.map((p) => (
            <article key={p.id} className="detail-mini-card">
              <img src={productImage} alt={p.name} className="detail-mini-img" />
              <span className="detail-mini-brand">{p.brand}</span>
              <p className="detail-mini-name">{p.name}</p>
              <p className="detail-mini-price">{p.price}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Recommended products */}
      <section className="detail-related-card">
        <h2 className="detail-section-title">추천 상품</h2>
        <div className="detail-related-scroll">
          {relatedProducts.map((p) => (
            <article key={p.id} className="detail-mini-card">
              <img src={productImage} alt={p.name} className="detail-mini-img" />
              <span className="detail-mini-brand">{p.brand}</span>
              <p className="detail-mini-name">{p.name}</p>
              <p className="detail-mini-price">{p.price}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="detail-review-card">
        <div className="detail-review-header">
          <h2 className="detail-review-title">리뷰 ★★★★★</h2>
          <span className="detail-review-count">(2048)</span>
        </div>

        <span className="detail-review-tab">포토/동영상</span>

        <div className="detail-photo-grid">
          {photoReviews.map((r) => (
            <div key={r.id} className="detail-photo-review-item">
              <div className="detail-review-thumb" />
              <div className="detail-review-body">
                <div className="detail-review-stars">{'★'.repeat(r.rating)}</div>
                <p className="detail-review-text">{r.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="detail-text-review-list">
          {textReviews.map((r) => (
            <div key={r.id} className="detail-text-review-item">
              <span className="detail-text-review-num">{r.id}</span>
              <p className="detail-text-review-content">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Error report */}
      <div className="detail-error-report">
        <span className="detail-error-title">오류 신고</span>
        <button type="button" className="detail-error-btn">오류 신고하기</button>
      </div>

      {/* Buy CTA */}
      <button type="button" className="detail-buy-btn">
        구매 페이지 바로가기
      </button>
    </div>
  )
}
