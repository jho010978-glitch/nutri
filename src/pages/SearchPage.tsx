import { useState } from 'react'
import { Typography } from '../components/Typography'
import { useProductListQuery } from '../queries/productQueries'
import type { ProductResponse } from '../api/products/types'
import type { Product } from '../types/product'

const popularKeywords = [
  '닭가슴살',
  '프로틴바',
  '그릭요거트',
  '오트밀',
  '두유',
  '샐러드',
  '고구마',
  '현미밥',
  '견과류',
  '참치캔',
]

type SearchPageProps = {
  onBack?: () => void
  onProductClick?: (product: Product) => void
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

export const SearchPage = ({ onBack, onProductClick }: SearchPageProps) => {
  const [inputValue, setInputValue] = useState('')
  const [submittedKeyword, setSubmittedKeyword] = useState('')

  const { data, isLoading, isError } = useProductListQuery(
    submittedKeyword ? { keyword: submittedKeyword } : undefined,
  )

  const handleSearch = (keyword: string) => {
    const trimmed = keyword.trim()
    if (!trimmed) return
    setInputValue(trimmed)
    setSubmittedKeyword(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch(inputValue)
  }

  const leftRankKeywords = popularKeywords.slice(0, 5)
  const rightRankKeywords = popularKeywords.slice(5, 10)
  const results = data?.content ?? []

  return (
    <section className="search-page" aria-label="검색 페이지">
      <Typography as="h2" className="search-page-title" variant="pageTitle" color="#989898">
        검색페이지
      </Typography>

      <div className="search-panel">
        <div className="search-input-row">
          <button type="button" className="search-back-btn" aria-label="뒤로 가기" onClick={onBack}>
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path d="M15.7 5.3a1 1 0 0 1 0 1.4L10.41 12l5.3 5.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.42 0Z" />
            </svg>
          </button>

          <input
            id="search-input"
            className="search-input"
            placeholder="검색"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {inputValue && (
            <button
              type="button"
              className="search-back-btn"
              aria-label="검색 실행"
              onClick={() => handleSearch(inputValue)}
              style={{ marginLeft: 4 }}
            >
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path d="M10.5 3a7.5 7.5 0 1 0 4.55 13.46l3.75 3.75a1 1 0 1 0 1.4-1.42l-3.74-3.74A7.5 7.5 0 0 0 10.5 3Zm-5.5 7.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z" />
              </svg>
            </button>
          )}
        </div>

        {/* 검색 결과 */}
        {submittedKeyword && (
          <section className="search-keyword-section" aria-label="검색 결과">
            <Typography as="h3" variant="sectionTitle">
              "{submittedKeyword}" 검색 결과
            </Typography>

            {isLoading && (
              <p style={{ color: '#888', fontSize: '0.9rem', padding: '1rem 0' }}>검색 중...</p>
            )}
            {isError && (
              <p style={{ color: '#b42318', fontSize: '0.9rem', padding: '1rem 0' }}>검색에 실패했습니다.</p>
            )}
            {!isLoading && !isError && results.length === 0 && (
              <p style={{ color: '#888', fontSize: '0.9rem', padding: '1rem 0' }}>검색 결과가 없습니다.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
              {results.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 0',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                  }}
                  onClick={() => onProductClick?.(mapToProduct(item))}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onProductClick?.(mapToProduct(item))}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0, background: '#f5f5f5' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: '#888', margin: '2px 0 0' }}>
                      {item.brand} · {item.categoryName}
                    </p>
                    <p style={{ fontSize: '0.82rem', fontWeight: 500, margin: '2px 0 0' }}>
                      {item.price != null ? `${item.price.toLocaleString('ko-KR')}원` : '-'}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#fff',
                      background: '#ff7f83',
                      borderRadius: 6,
                      padding: '2px 7px',
                      flexShrink: 0,
                    }}
                  >
                    {item.grade}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 인기 검색어 - 검색 전에만 표시 */}
        {!submittedKeyword && (
          <section className="search-keyword-section" aria-label="인기 검색어">
            <Typography as="h3" variant="sectionTitle">
              인기 검색어
            </Typography>

            <div className="popular-keyword-grid">
              <ol className="popular-keyword-list">
                {leftRankKeywords.map((keyword, index) => (
                  <li key={keyword} className="popular-keyword-item">
                    <Typography as="span" className="popular-rank" variant="body">
                      {index + 1}
                    </Typography>
                    <button
                      type="button"
                      className="popular-term"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
                      onClick={() => handleSearch(keyword)}
                    >
                      {keyword}
                    </button>
                  </li>
                ))}
              </ol>

              <ol className="popular-keyword-list" start={6}>
                {rightRankKeywords.map((keyword, index) => (
                  <li key={keyword} className="popular-keyword-item">
                    <Typography as="span" className="popular-rank" variant="body">
                      {index + 6}
                    </Typography>
                    <button
                      type="button"
                      className="popular-term"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
                      onClick={() => handleSearch(keyword)}
                    >
                      {keyword}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </div>
    </section>
  )
}
