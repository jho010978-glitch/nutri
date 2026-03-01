import { useState } from 'react'
import './UserProfileSetupModal.css'

type Profile = {
  height: string
  weight: string
  jobType: string
  exerciseFreq: string
  exerciseIntensity: string
  mealsPerDay: string
  snacksPerDay: string
  bodyFatPct: string
  skeletalMuscle: string
}

type Props = {
  onClose: () => void
  onComplete: (profile: Profile) => void
}

const TOTAL_STEPS = 4

export const UserProfileSetupModal = ({ onClose, onComplete }: Props) => {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Profile>({
    height: '',
    weight: '',
    jobType: '',
    exerciseFreq: '',
    exerciseIntensity: '',
    mealsPerDay: '',
    snacksPerDay: '',
    bodyFatPct: '',
    skeletalMuscle: '',
  })

  const set = (key: keyof Profile) => (val: string) =>
    setProfile(p => ({ ...p, [key]: val }))

  const goNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1)
    else onComplete(profile)
  }

  const goBack = () => setStep(s => s - 1)

  return (
    <div className="ups-root">
      <button className="ups-close" type="button" onClick={onClose} aria-label="닫기">
        ✕
      </button>

      <p className="ups-title">영양점수 제공을 위한정보가 필요해요</p>

      <div className="ups-body">
        {step === 1 && (
          <>
            <NumberField label="키" unit="cm" value={profile.height} onChange={set('height')} />
            <NumberField label="몸무게" unit="kg" value={profile.weight} onChange={set('weight')} />
          </>
        )}

        {step === 2 && (
          <>
            <OptionGroup
              label="직업 형태"
              options={['앉아서', '서서', '육체노동']}
              value={profile.jobType}
              onChange={set('jobType')}
            />
            <OptionGroup
              label="주당 운동 횟수"
              options={['주 1회', '주 2~4회', '주 5회 이상']}
              value={profile.exerciseFreq}
              onChange={set('exerciseFreq')}
            />
            <OptionGroup
              label="운동 강도"
              options={['주 1회', '주 2~4회', '주 5회 이상']}
              value={profile.exerciseIntensity}
              onChange={set('exerciseIntensity')}
            />
          </>
        )}

        {step === 3 && (
          <>
            <NumberField label="하루 끼니 수" value={profile.mealsPerDay} onChange={set('mealsPerDay')} />
            <NumberField label="간식 횟수" value={profile.snacksPerDay} onChange={set('snacksPerDay')} />
          </>
        )}

        {step === 4 && (
          <>
            <NumberField label="체지방률" unit="%" value={profile.bodyFatPct} onChange={set('bodyFatPct')} />
            <NumberField label="골격근량" unit="kg" value={profile.skeletalMuscle} onChange={set('skeletalMuscle')} />
            <p className="ups-hint">필수로 입력하지 않아도 돼요</p>
          </>
        )}
      </div>

      <div className="ups-footer">
        <div className={`ups-btn-row${step === 1 ? ' ups-btn-row--single' : ''}`}>
          {step > 1 && (
            <button type="button" className="ups-back-btn" onClick={goBack}>
              뒤로
            </button>
          )}
          <button type="button" className="ups-next-btn" onClick={goNext}>
            {step === TOTAL_STEPS ? '완료' : '다음'}
          </button>
        </div>

        <div className="ups-progress-bar">
          <div
            className="ups-progress-fill"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── 내부 컴포넌트 ───────────────────────────────────────────────────────────

type NumberFieldProps = {
  label: string
  unit?: string
  value: string
  onChange: (v: string) => void
}

const NumberField = ({ label, unit, value, onChange }: NumberFieldProps) => (
  <div className="ups-field">
    <span className="ups-field-label">{label}</span>
    <div className="ups-number-row">
      <input
        className={`ups-number-input${unit ? ' ups-number-input--compact' : ' ups-number-input--wide'}`}
        type="number"
        min={0}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {unit && <span className="ups-unit">{unit}</span>}
    </div>
  </div>
)

type OptionGroupProps = {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}

const OptionGroup = ({ label, options, value, onChange }: OptionGroupProps) => (
  <div className="ups-field">
    <span className="ups-field-label">{label}</span>
    <div className="ups-options">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          className={`ups-opt-btn${value === opt ? ' ups-opt-btn--on' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
)
