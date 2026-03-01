import { useState } from 'react'
import './FilterPage.css'
import { Typography } from '../components/Typography'

type FilterPageProps = {
  onBack?: () => void
}

type FilterGroupKey = 'category' | 'brand' | 'nutrition'

const CATEGORIES = ['영양제', '단백질', '탄수화물', '비타민', '미네랄', '건강식품', '다이어트', '프로바이오틱스']

const BRANDS = ['닥터베스트', '나우푸드', '솔가', '얼티맥스', '뉴트리코어', '바이탈', '비타민마트', 'GNC']

type NutrientConfig = {
  key: string
  label: string
  unit: string
  absMax: number
  step: number
  defaultMax: number
}

const NUTRIENTS: NutrientConfig[] = [
  { key: 'calories', label: '칼로리', unit: 'kcal', absMax: 1000, step: 10, defaultMax: 1000 },
  { key: 'carbs', label: '탄수화물', unit: 'g', absMax: 100, step: 1, defaultMax: 100 },
  { key: 'protein', label: '단백질', unit: 'g', absMax: 50, step: 1, defaultMax: 50 },
  { key: 'fat', label: '지방', unit: 'g', absMax: 50, step: 1, defaultMax: 50 },
  { key: 'sugar', label: '당류', unit: 'g', absMax: 50, step: 1, defaultMax: 50 },
  { key: 'sodium', label: '나트륨', unit: 'mg', absMax: 500, step: 5, defaultMax: 500 },
]

type RangeState = { min: number; max: number }

type NutritionRanges = Record<string, RangeState>

const initNutritionRanges = (): NutritionRanges =>
  Object.fromEntries(NUTRIENTS.map((n) => [n.key, { min: 0, max: n.defaultMax }]))

type RangeSliderProps = {
  nutrient: NutrientConfig
  value: RangeState
  onChange: (next: RangeState) => void
}

const RangeSlider = ({ nutrient, value, onChange }: RangeSliderProps) => {
  const { absMax, step, unit, label } = nutrient
  const minPct = (value.min / absMax) * 100
  const maxPct = (value.max / absMax) * 100

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.min(Number(e.target.value), value.max - step)
    onChange({ ...value, min: next })
  }

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.max(Number(e.target.value), value.min + step)
    onChange({ ...value, max: next })
  }

  const isAtMax = value.max >= absMax

  return (
    <div className="nutrient-row">
      <Typography as="p" variant="label" weight="medium" color="#3a3a3a">
        {label}
      </Typography>
      <div className="range-label-row">
        <span className="range-label-value">
          {value.min}
          {unit}
        </span>
        <span className="range-label-sep">~</span>
        <span className="range-label-value">
          {value.max}
          {unit}
          {isAtMax ? '+' : ''}
        </span>
      </div>
      <div className="range-track-wrap">
        <div className="range-track">
          <div
            className="range-fill"
            style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
          />
        </div>
        <input
          type="range"
          className="range-input range-input-min"
          min={0}
          max={absMax}
          step={step}
          value={value.min}
          onChange={handleMin}
          aria-label={`${label} 최솟값`}
        />
        <input
          type="range"
          className="range-input range-input-max"
          min={0}
          max={absMax}
          step={step}
          value={value.max}
          onChange={handleMax}
          aria-label={`${label} 최댓값`}
        />
      </div>
    </div>
  )
}

export const FilterPage = ({ onBack }: FilterPageProps) => {
  const [openGroups, setOpenGroups] = useState<Set<FilterGroupKey>>(new Set())
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set())
  const [nutritionRanges, setNutritionRanges] = useState<NutritionRanges>(initNutritionRanges)

  const toggle = (group: FilterGroupKey) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) {
        next.delete(group)
      } else {
        next.add(group)
      }
      return next
    })
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev)
      if (next.has(brand)) next.delete(brand)
      else next.add(brand)
      return next
    })
  }

  const handleReset = () => {
    setOpenGroups(new Set())
    setSelectedCategories(new Set())
    setSelectedBrands(new Set())
    setNutritionRanges(initNutritionRanges())
  }

  const groups: { key: FilterGroupKey; label: string }[] = [
    { key: 'category', label: '카테고리' },
    { key: 'brand', label: '브랜드' },
    { key: 'nutrition', label: '영양성분' },
  ]

  return (
    <section className="filter-sheet" aria-label="필터">
      <div className="filter-handle" aria-hidden="true" />

      <header className="filter-header">
        <button type="button" className="filter-back-btn" aria-label="뒤로 가기" onClick={onBack}>
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path d="M15.7 5.3a1 1 0 0 1 0 1.4L10.41 12l5.3 5.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.42 0Z" />
          </svg>
        </button>
        <Typography as="h2" variant="bodyStrong" color="#141414" style={{ textAlign: 'center', letterSpacing: '-0.02em' }}>
          필터
        </Typography>
        <span className="filter-header-spacer" aria-hidden="true" />
      </header>

      <div className="filter-reset-row">
        <button type="button" className="filter-reset-btn" onClick={handleReset}>
          <Typography as="span" variant="body" color="#8a8a8a" style={{ lineHeight: 1 }}>
            초기화
          </Typography>
        </button>
      </div>

      <ul className="filter-group-list">
        {groups.map(({ key, label }) => {
          const isOpen = openGroups.has(key)
          return (
            <li key={key} className="filter-group-item">
              <button
                type="button"
                className={`filter-group-btn${isOpen ? ' open' : ''}`}
                aria-expanded={isOpen}
                onClick={() => toggle(key)}
              >
                <Typography as="span" variant="body" weight="medium">
                  {label}
                </Typography>
                <svg
                  viewBox="0 0 24 24"
                  role="img"
                  aria-hidden="true"
                  className={`filter-chevron${isOpen ? ' rotated' : ''}`}
                >
                  <path d="M6.3 8.3a1 1 0 0 1 1.4 0l4.3 4.3 4.3-4.3a1 1 0 0 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 0 1 0-1.4Z" />
                </svg>
              </button>

              <div className={`filter-group-content${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
                <div className="filter-group-inner">
                  {key === 'category' && (
                    <div className="category-chip-list">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`category-chip${selectedCategories.has(cat) ? ' selected' : ''}`}
                          onClick={() => toggleCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}

                  {key === 'brand' && (
                    <ul className="brand-list">
                      {BRANDS.map((brand) => (
                        <li key={brand}>
                          <label className="brand-label">
                            <input
                              type="checkbox"
                              className="brand-checkbox"
                              checked={selectedBrands.has(brand)}
                              onChange={() => toggleBrand(brand)}
                            />
                            <Typography as="span" variant="body" color="#3a3a3a">
                              {brand}
                            </Typography>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}

                  {key === 'nutrition' && (
                    <div className="nutrition-list">
                      {NUTRIENTS.map((nutrient) => (
                        <RangeSlider
                          key={nutrient.key}
                          nutrient={nutrient}
                          value={nutritionRanges[nutrient.key]}
                          onChange={(next) =>
                            setNutritionRanges((prev) => ({ ...prev, [nutrient.key]: next }))
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
