import { Typography } from '../../../components/Typography'
import { compactToIso, presetToRange, rangeDayCount } from '../../../lib/dateRange'
import type { DateRange, PeriodPreset } from '../../../types/admin'

export type PeriodFilterValue = {
  preset: PeriodPreset
  range: DateRange
}

type PeriodFilterChipsProps = {
  value: PeriodFilterValue
  onChange: (next: PeriodFilterValue) => void
}

// 서버가 /admin/stats/* 전체에 30일 상한을 걸어두어(초과 시 400) 프리셋만 제공한다
const PRESETS: { key: PeriodPreset; label: string }[] = [
  { key: 'today', label: '오늘' },
  { key: '7d', label: '최근 7일' },
  { key: '30d', label: '최근 30일' },
]

export const PeriodFilterChips = ({ value, onChange }: PeriodFilterChipsProps) => {
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
      </div>

      <Typography as="p" variant="label" weight="regular" color="#8a8a8e">
        {compactToIso(value.range.start)} ~ {compactToIso(value.range.end)} · {days}일
      </Typography>
    </div>
  )
}
