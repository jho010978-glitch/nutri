const numberFormatter = new Intl.NumberFormat('ko-KR')

export const CHART_HEIGHT = 220
export const axisStyle = { fontSize: 11, fill: '#8a8a8e' }
export const gridStroke = '#eee'

export const tooltipStyle = {
  contentStyle: { borderRadius: 8, border: '1px solid #e3e3e3', fontSize: 12 },
  labelStyle: { color: '#666', fontSize: 11 },
}

export type ChartSeries = {
  key: string
  name: string
  color: string
}

// yyyy-MM-dd → M/D (축 라벨은 짧아야 모바일에서 겹치지 않는다)
export const toShortDate = (iso: string) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`

// recharts 3의 Tooltip formatter는 value/name이 unknown 계열이라 좁혀서 쓴다
export const formatCount = (value: unknown, name: unknown) =>
  [typeof value === 'number' ? numberFormatter.format(value) : String(value ?? ''), String(name ?? '')] as [
    string,
    string,
  ]
