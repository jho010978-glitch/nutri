import { useState } from 'react'
import './UserProfileSetupModal.css'

export type Profile = {
  // step 1 — /auth/register
  name: string
  email: string
  gender: 'MALE' | 'FEMALE' | ''
  birth_date: string
  // step 2-4 — /users/me/nutrition
  height: string
  weight: string
  body_fat_rate: string
  skeletal_muscle_mass: string
  activity_type: string
  weekly_exercise_count: string
  exercise_intensity: string
  daily_meal_count: number
  daily_snack_count: number
  diet_purpose: string
}

type Props = {
  onClose: () => void
  onComplete: (profile: Profile) => void
  initialProfile?: Profile
  submitLabel?: string
}

const DIET_GOALS = ['다이어트', '벌크업', '린매스업', '건강한식생활', '기타']
const TOTAL_STEPS = 4

const initial: Profile = {
  name: '', email: '', gender: '', birth_date: '',
  height: '', weight: '', body_fat_rate: '', skeletal_muscle_mass: '',
  activity_type: '', weekly_exercise_count: '', exercise_intensity: '',
  daily_meal_count: 3, daily_snack_count: 1, diet_purpose: '',
}

export const UserProfileSetupModal = ({ onClose, onComplete, initialProfile, submitLabel }: Props) => {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Profile>(initialProfile ?? initial)

  const set = <K extends keyof Profile>(k: K) => (v: Profile[K]) =>
    setProfile(p => ({ ...p, [k]: v }))

  const isStepValid = (): boolean => {
    if (step === 1) return !!(profile.name && profile.email && profile.gender && profile.birth_date)
    if (step === 2) return !!(profile.height && profile.weight)
    if (step === 3) return !!(profile.activity_type && profile.weekly_exercise_count && profile.exercise_intensity)
    if (step === 4) return !!(profile.diet_purpose)
    return false
  }

  const handleBack = () => {
    if (step === 1) onClose()
    else setStep(s => s - 1)
  }

  const handleNext = () => {
    if (!isStepValid()) return
    if (step < TOTAL_STEPS) setStep(s => s + 1)
    else onComplete(profile)
  }

  const valid = isStepValid()

  return (
    <div className="ups-root">
      <button className="ups-back" type="button" onClick={handleBack} aria-label="뒤로">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M15.7 5.3a1 1 0 0 1 0 1.4L10.41 12l5.3 5.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.42 0Z" fill="#111"/>
        </svg>
      </button>

      <div className="ups-steps" aria-label={`단계 ${step}/${TOTAL_STEPS}`}>
        {[1, 2, 3, 4].map(n => (
          <span key={n} className={`ups-step${n === step ? ' ups-step--on' : ''}`}>{n}</span>
        ))}
      </div>

      <h2 className="ups-title">
        내 몸에 맞는 영양점수,<br />1분이면 끝나요
      </h2>

      <div className="ups-body">
        {step === 1 && (
          <>
            <TextField label="이름" placeholder="이름을 입력해 주세요" value={profile.name} onChange={set('name')} />
            <TextField label="이메일" placeholder="이메일 주소를 입력해 주세요" type="email" value={profile.email} onChange={set('email')} />
            <div className="ups-field">
              <span className="ups-field-label">성별</span>
              <div className="ups-gender">
                <button type="button" className={`ups-gender-btn${profile.gender === 'MALE' ? ' on' : ''}`} onClick={() => set('gender')('MALE')}>남성</button>
                <button type="button" className={`ups-gender-btn${profile.gender === 'FEMALE' ? ' on' : ''}`} onClick={() => set('gender')('FEMALE')}>여성</button>
              </div>
            </div>
            <div className="ups-field">
              <span className="ups-field-label">생년월일</span>
              <input className="ups-text-input" type="date" placeholder="생년월일" value={profile.birth_date} onChange={e => set('birth_date')(e.target.value)} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="ups-grid-2">
              <NumberField label="키" unit="cm" value={profile.height} onChange={set('height')} />
              <NumberField label="몸무게" unit="kg" value={profile.weight} onChange={set('weight')} />
            </div>
            <p className="ups-required-hint">*필수</p>
            <div className="ups-grid-2" style={{ marginTop: 4 }}>
              <NumberField label="체지방률" unit="%" value={profile.body_fat_rate} onChange={set('body_fat_rate')} />
              <NumberField label="골격근량" unit="kg" value={profile.skeletal_muscle_mass} onChange={set('skeletal_muscle_mass')} />
            </div>
            <p className="ups-optional-hint">*선택</p>
          </>
        )}

        {step === 3 && (
          <>
            <OptionGroup label="활동 유형" options={['SITTING', 'STANDING', 'PHYSICAL']} value={profile.activity_type} onChange={set('activity_type')} />
            <OptionGroup label="주간 운동 횟수" options={['1', '2', '3', '4', '5', '6', '7']} value={profile.weekly_exercise_count} onChange={set('weekly_exercise_count')} />
            <OptionGroup label="운동 강도" options={['LOW', 'MEDIUM', 'HIGH']} value={profile.exercise_intensity} onChange={set('exercise_intensity')} />
          </>
        )}

        {step === 4 && (
          <>
            <StepperField label="하루 끼니 수" value={profile.daily_meal_count} min={1} max={10} onChange={v => set('daily_meal_count')(v)} />
            <StepperField label="간식 횟수" value={profile.daily_snack_count} min={0} max={10} onChange={v => set('daily_snack_count')(v)} />
            <div className="ups-field">
              <span className="ups-field-label">식이 목적</span>
              <div className="ups-select-wrap">
                <select
                  className="ups-select"
                  value={profile.diet_purpose}
                  onChange={e => set('diet_purpose')(e.target.value)}
                >
                  <option value="" disabled>선택해 주세요</option>
                  {DIET_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <span className="ups-select-arrow" aria-hidden="true">▾</span>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        className={`ups-submit${valid ? ' ups-submit--on' : ''}`}
        onClick={handleNext}
        disabled={!valid}
      >
        {step === TOTAL_STEPS ? (submitLabel ?? '완료하기') : '다음'}
      </button>
    </div>
  )
}

// ── 내부 컴포넌트 ──────────────────────────────────────────────

type TextFieldProps = { label: string; placeholder?: string; value: string; onChange: (v: string) => void; type?: string }
const TextField = ({ label, placeholder, value, onChange, type = 'text' }: TextFieldProps) => (
  <div className="ups-field">
    <span className="ups-field-label">{label}</span>
    <input className="ups-text-input" type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
  </div>
)

type NumberFieldProps = { label: string; unit?: string; value: string; onChange: (v: string) => void }
const NumberField = ({ label, unit, value, onChange }: NumberFieldProps) => (
  <div className="ups-field">
    <span className="ups-field-label">{label}</span>
    <div className="ups-num-row">
      <input className="ups-num-input" type="number" min={0} placeholder="0" value={value} onChange={e => onChange(e.target.value)} />
      {unit && <span className="ups-unit">{unit}</span>}
    </div>
  </div>
)

type StepperFieldProps = { label: string; value: number; min: number; max: number; onChange: (v: number) => void }
const StepperField = ({ label, value, min, max, onChange }: StepperFieldProps) => (
  <div className="ups-field">
    <span className="ups-field-label">{label}</span>
    <div className="ups-stepper">
      <button type="button" className="ups-stepper-btn" onClick={() => onChange(Math.max(min, value - 1))} aria-label="감소">−</button>
      <span className="ups-stepper-val">{value}</span>
      <button type="button" className="ups-stepper-btn" onClick={() => onChange(Math.min(max, value + 1))} aria-label="증가">+</button>
    </div>
  </div>
)

type OptionGroupProps = { label: string; options: string[]; value: string; onChange: (v: string) => void }
const OptionGroup = ({ label, options, value, onChange }: OptionGroupProps) => (
  <div className="ups-field">
    <span className="ups-field-label">{label}</span>
    <div className="ups-options">
      {options.map(opt => (
        <button key={opt} type="button" className={`ups-opt-btn${value === opt ? ' on' : ''}`} onClick={() => onChange(opt)}>
          {opt}
        </button>
      ))}
    </div>
  </div>
)
