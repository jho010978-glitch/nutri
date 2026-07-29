import { Typography } from '../../../components/Typography'
import { compactToIso, isoToCompact, presetToRange, rangeDayCount, toYyyyMmDd } from '../../../lib/dateRange'
import type { DateRange, PeriodPreset } from '../../../types/admin'

export type PeriodFilterValue = {
  preset: PeriodPreset
  range: DateRange
}

type PeriodFilterChipsProps = {
  value: PeriodFilterValue
  onChange: (next: PeriodFilterValue) => void
}

const PRESETS: { key: Exclude<PeriodPreset, 'custom'>; label: string }[] = [
  { key: 'today', label: '오늘' },
  { key: '7d', label: '최근 7일' },
  { key: '30d', label: '최근 30일' },
]

export const PeriodFilterChips = ({ value, onChange }: PeriodFilterChipsProps) => {
  const todayIso = compactToIso(toYyyyMmDd(new Date()))
  const days = rangeDayCount(value.range)

  return (
    <div className="admin-period">
      <div className="admin-period-chips" role="group" aria-label="조회 기간">
        {PRESETS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className="admin-period-chip"
            aria-pressed={value.preset === key}
            onClick={() => onChange({ preset: key, range: presetToRange(key) })}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className="admin-period-chip"
          aria-pressed={value.preset === 'custom'}
          onClick={() => onChange({ preset: 'custom', range: value.range })}
        >
          직접 선택
        </button>
      </div>

      {value.preset === 'custom' ? (
        <div className="admin-period-custom">
          <input
            type="date"
            className="admin-period-date"
            aria-label="시작일"
            value={compactToIso(value.range.start)}
            max={compactToIso(value.range.end)}
            onChange={(e) => {
              if (!e.target.value) return
              // min/max는 picker만 막는다 — 키보드 입력으로 역순이 오면 반대쪽 끝점을 당겨서 정규화
              const start = isoToCompact(e.target.value)
              onChange({ preset: 'custom', range: { start, end: start > value.range.end ? start : value.range.end } })
            }}
          />
          <Typography as="span" variant="label" weight="regular" color="#8a8a8e">
            ~
          </Typography>
          <input
            type="date"
            className="admin-period-date"
            aria-label="종료일"
            value={compactToIso(value.range.end)}
            min={compactToIso(value.range.start)}
            max={todayIso}
            onChange={(e) => {
              if (!e.target.value) return
              const end = isoToCompact(e.target.value)
              onChange({ preset: 'custom', range: { start: end < value.range.start ? end : value.range.start, end } })
            }}
          />
        </div>
      ) : null}

      <Typography as="p" variant="label" weight="regular" color="#8a8a8e">
        {compactToIso(value.range.start)} ~ {compactToIso(value.range.end)} · {days}일
      </Typography>
    </div>
  )
}
