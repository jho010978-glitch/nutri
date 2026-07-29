import type { DateRange, PeriodPreset } from '../types/admin'

export const toYyyyMmDd = (d: Date) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`

export const parseYyyyMmDd = (s: string) =>
  new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T00:00:00`)

// 날짜 산술은 항상 setDate — getTime()+86400000은 DST 전환일에 하루가 중복/누락된다
const shiftDays = (d: Date, days: number) => {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

// 프리셋 → 로컬(KST) 기준 기간. 7일/30일은 오늘 포함 최근 N일.
// 시계는 한 번만 읽는다 — 두 번 읽으면 자정을 걸칠 때 기간 길이가 어긋난다
export const presetToRange = (preset: Exclude<PeriodPreset, 'custom'>): DateRange => {
  const now = new Date()
  const end = toYyyyMmDd(now)
  switch (preset) {
    case 'today':
      return { start: end, end }
    case '7d':
      return { start: toYyyyMmDd(shiftDays(now, -6)), end }
    case '30d':
      return { start: toYyyyMmDd(shiftDays(now, -29)), end }
  }
}

// 나눗셈 오차는 DST 하루당 최대 1시간이라 round가 흡수한다. 역순 범위(end < start)는 0
export const rangeDayCount = ({ start, end }: DateRange) => {
  const diffDays = (parseYyyyMmDd(end).getTime() - parseYyyyMmDd(start).getTime()) / 86400000
  return Math.max(0, Math.round(diffDays) + 1)
}

// KPI 증감 비교용: 현재 기간과 인접한 직전 같은 길이 기간 (예: 7/19~7/25 → 7/12~7/18)
export const previousRange = (range: DateRange): DateRange => {
  const days = rangeDayCount(range)
  const prevEnd = shiftDays(parseYyyyMmDd(range.start), -1)
  return { start: toYyyyMmDd(shiftDays(prevEnd, -(days - 1))), end: toYyyyMmDd(prevEnd) }
}

// yyyyMMdd 범위를 날짜 배열로 전개
export const expandRange = ({ start, end }: DateRange): Date[] => {
  const dates: Date[] = []
  const last = parseYyyyMmDd(end)
  for (const d = parseYyyyMmDd(start); d <= last; d.setDate(d.getDate() + 1)) dates.push(new Date(d))
  return dates
}

// <input type="date"> 값(yyyy-MM-dd) ↔ yyyyMMdd 변환
export const isoToCompact = (iso: string) => iso.replaceAll('-', '')
export const compactToIso = (s: string) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
