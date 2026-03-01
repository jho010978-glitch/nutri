import { BackArrowIcon } from '../components/icons'
import type { Product } from '../types/product'
import './ComparePage.css'

// ── Radar Chart ───────────────────────────────────────────────

const AXES = ['영양점수', '칼로리', '탄수화물', '지방', '당', '단백질', '당류'] as const
const N = AXES.length
const CX = 100
const CY = 100
const R = 62
const LABEL_R = 80
const LEVELS = 3
const COLORS: [string, string] = ['#ff7f83', '#608ef2']

function axisAngle(i: number) {
  return -Math.PI / 2 + (2 * Math.PI * i) / N
}

function polarXY(angle: number, r: number) {
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) }
}

function polygonPoints(values: number[]) {
  return values
    .map((v, i) => {
      const { x, y } = polarXY(axisAngle(i), (v / 100) * R)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

function gridPoints(level: number) {
  const r = (R * level) / LEVELS
  return Array.from({ length: N }, (_, i) => {
    const { x, y } = polarXY(axisAngle(i), r)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
}

function labelAnchor(i: number): {
  textAnchor: 'start' | 'end' | 'middle'
  dominantBaseline: 'hanging' | 'auto' | 'middle'
} {
  const angle = axisAngle(i)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const textAnchor: 'start' | 'end' | 'middle' = cos > 0.1 ? 'start' : cos < -0.1 ? 'end' : 'middle'
  const dominantBaseline: 'hanging' | 'auto' | 'middle' = sin > 0.1 ? 'hanging' : sin < -0.1 ? 'auto' : 'middle'
  return { textAnchor, dominantBaseline }
}

function productRadarValues(product: Product): number[] {
  const parseNum = (s: string) => parseFloat(s) || 0
  // Axes: 영양점수, 칼로리(inv), 탄수화물(inv), 지방(inv), 당(inv), 단백질, 당류(inv)
  const score = product.score
  const cal = parseNum(product.calories)     // kcal, lower better
  const carbs = parseNum(product.carbs)      // g, lower better
  const fat = parseNum(product.fat)          // g, lower better
  const sugar = parseNum(product.sugar ?? '0') // g, lower better
  const protein = parseNum(product.protein)  // g, higher better
  const sodium = parseNum(product.sodium ?? '300') // mg, lower better

  return [
    score,                                          // 영양점수: higher better
    Math.max(0, 100 - (cal / 250) * 100),           // 칼로리: 0kcal=100
    Math.max(0, 100 - (carbs / 25) * 100),          // 탄수화물: 0g=100
    Math.max(0, 100 - (fat / 15) * 100),            // 지방: 0g=100
    Math.max(0, 100 - (sugar / 10) * 100),          // 당: 0g=100
    Math.min(100, (protein / 30) * 100),            // 단백질: 30g=100
    Math.max(0, 100 - (sodium / 800) * 100),        // 당류: 0mg=100
  ]
}

function RadarChart({ products }: { products: [Product, Product] }) {
  return (
    <svg viewBox="0 0 200 200" className="compare-radar-svg">
      {/* Grid polygons */}
      {Array.from({ length: LEVELS }, (_, lvl) => (
        <polygon
          key={lvl}
          points={gridPoints(lvl + 1)}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="0.7"
        />
      ))}

      {/* Axis lines */}
      {Array.from({ length: N }, (_, i) => {
        const { x, y } = polarXY(axisAngle(i), R)
        return (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={x.toFixed(2)}
            y2={y.toFixed(2)}
            stroke="#e0e0e0"
            strokeWidth="0.7"
          />
        )
      })}

      {/* Data polygons */}
      {products.map((p, pi) => (
        <polygon
          key={p.id}
          points={polygonPoints(productRadarValues(p))}
          fill={COLORS[pi] + '40'}
          stroke={COLORS[pi]}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      ))}

      {/* Axis labels */}
      {AXES.map((label, i) => {
        const angle = axisAngle(i)
        const { x, y } = polarXY(angle, LABEL_R)
        const { textAnchor, dominantBaseline } = labelAnchor(i)
        return (
          <text
            key={label}
            x={x.toFixed(2)}
            y={y.toFixed(2)}
            fontSize="7.5"
            textAnchor={textAnchor}
            dominantBaseline={dominantBaseline}
            fill="#555"
            fontWeight="600"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}

// ── Nutrition comparison rows ─────────────────────────────────

type NutriRow = {
  label: string
  ref?: string   // daily reference value shown in gray
  a: string
  b: string
  lowerBetter: boolean
}

function buildNutriRows(a: Product, b: Product): NutriRow[] {
  return [
    { label: '영양점수', a: `${a.score}점`, b: `${b.score}점`, lowerBetter: false },
    { label: '열량', ref: '2,000 kcal/일', a: a.calories, b: b.calories, lowerBetter: true },
    { label: '탄수화물', ref: '130 g/일', a: a.carbs, b: b.carbs, lowerBetter: true },
    { label: '단백질', ref: '55 g/일', a: a.protein, b: b.protein, lowerBetter: false },
    { label: '지방', ref: '66.7 g', a: a.fat, b: b.fat, lowerBetter: true },
    { label: '당', ref: '50g', a: a.sugar ?? '-', b: b.sugar ?? '-', lowerBetter: true },
    { label: '포화지방', ref: '15.6 g', a: a.saturatedFat ?? '-', b: b.saturatedFat ?? '-', lowerBetter: true },
    { label: '트랜스지방', ref: '2.2 g', a: a.transFat ?? '-', b: b.transFat ?? '-', lowerBetter: true },
    { label: '콜레스테롤', ref: '300 mg/일', a: a.cholesterol ?? '-', b: b.cholesterol ?? '-', lowerBetter: true },
  ]
}

function indicator(
  va: string,
  vb: string,
  lowerBetter: boolean,
  isLeft: boolean,
): 'better' | 'worse' | 'same' {
  const a = parseFloat(va) || 0
  const b = parseFloat(vb) || 0
  if (a === b) return 'same'
  const isBetter = isLeft ? (lowerBetter ? a < b : a > b) : (lowerBetter ? b < a : b > a)
  return isBetter ? 'better' : 'worse'
}

// ── Score Ring ────────────────────────────────────────────────

function ScoreRing({ score, colorIdx }: { score: number; colorIdx: 0 | 1 }) {
  const color = COLORS[colorIdx]
  const deg = score * 3.6
  return (
    <div
      className="compare-score-ring"
      style={{
        background: `conic-gradient(${color} 0deg ${deg}deg, #e8e8e8 ${deg}deg 360deg)`,
      }}
    >
      <div className="compare-score-inner">
        <span className="compare-score-num">{score}</span>
      </div>
    </div>
  )
}

// ── Product Card ──────────────────────────────────────────────

function CompareCard({
  product,
  rows,
  colorIdx,
  isLeft,
}: {
  product: Product
  rows: NutriRow[]
  colorIdx: 0 | 1
  isLeft: boolean
}) {
  const color = COLORS[colorIdx]
  return (
    <div className="compare-card">
      {/* Score ring badge */}
      <ScoreRing score={product.score} colorIdx={colorIdx} />

      {/* Product image + name */}
      <div className="compare-card-product-row">
        <img src={product.image} alt={product.name} className="compare-card-img" />
        <div className="compare-card-product-info">
          <p className="compare-card-name">{product.name}</p>
          <p className="compare-card-price">{product.price}</p>
        </div>
      </div>

      {/* 종합 점수 box */}
      <div className="compare-card-score-box" style={{ borderColor: color }}>
        <span className="compare-card-score-label">종합 점수</span>
        <div className="compare-card-score-value">
          <span className="compare-card-score-num">{product.score}</span>
          <span className="compare-card-score-unit">점</span>
        </div>
      </div>

      {/* Nutrition list */}
      <ul className="compare-nutri-list">
        {rows.map((row) => {
          const val = isLeft ? row.a : row.b
          const ind = indicator(row.a, row.b, row.lowerBetter, isLeft)
          return (
            <li key={row.label} className="compare-nutri-item">
              <div className="compare-nutri-label-row">
                <span className="compare-nutri-name">{row.label}</span>
                {row.ref && <span className="compare-nutri-ref">{row.ref}</span>}
              </div>
              <div className="compare-nutri-val-row">
                <span className={`compare-nutri-arrow compare-nutri-arrow--${ind}`}>▶</span>
                <span className="compare-nutri-val">{val}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────

type ComparePageProps = {
  products: [Product, Product]
  onBack: () => void
}

export function ComparePage({ products, onBack }: ComparePageProps) {
  const [p0, p1] = products
  const rows = buildNutriRows(p0, p1)

  return (
    <div className="compare-page">
      <header className="compare-header">
        <button type="button" className="icon-btn" aria-label="뒤로가기" onClick={onBack}>
          <BackArrowIcon />
        </button>
        <h2 className="compare-header-title">비교페이지</h2>
        <div style={{ width: 24 }} />
      </header>

      {/* Featured product */}
      <div className="compare-featured">
        <div className="compare-featured-images">
          {Array.from({ length: 6 }).map((_, i) => (
            <img key={i} src={p0.image} alt={p0.name} className="compare-featured-img" />
          ))}
        </div>
        <div className="compare-featured-info">
          <h3 className="compare-featured-name">{p0.name}</h3>
          <p className="compare-featured-price">{p0.price}</p>
          <p className="compare-featured-stars">★★★★★</p>
        </div>
      </div>

      <p className="compare-section-title">비교하기</p>

      {/* Radar chart */}
      <div className="compare-radar-wrap">
        <RadarChart products={products} />
      </div>

      {/* Comparison cards */}
      <div className="compare-cards-row">
        <CompareCard product={p0} rows={rows} colorIdx={0} isLeft={true} />
        <CompareCard product={p1} rows={rows} colorIdx={1} isLeft={false} />
      </div>
    </div>
  )
}
