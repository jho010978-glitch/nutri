import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { updateMe } from '../api/auth'
import { myPageKeys } from '../queries/myPageQueries'
import './PasswordChangePage.css'

type Props = { onBack: () => void }

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
    <path d="M15.7 5.3a1 1 0 0 1 0 1.4L10.41 12l5.3 5.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.42 0Z" fill="#111"/>
  </svg>
)

export const PasswordChangePage = ({ onBack }: Props) => {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const canSubmit = !saving && (name || nickname || email || gender || birthDate).length > 0

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSaving(true)
    setError('')
    try {
      const payload: Record<string, string> = {}
      if (name) payload.name = name
      if (nickname) payload.nickname = nickname
      if (email) payload.email = email
      if (gender) payload.gender = gender
      if (birthDate) payload.birth_date = birthDate
      await updateMe(payload)
      await queryClient.invalidateQueries({ queryKey: myPageKeys.me })
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="pw-page">
        <header className="pw-header">
          <button type="button" className="pw-back" aria-label="뒤로가기" onClick={onBack}>
            <ArrowLeftIcon />
          </button>
          <h2 className="pw-title">회원정보 변경</h2>
        </header>
        <div className="pw-body" style={{ textAlign: 'center', paddingTop: '3rem' }}>
          <p style={{ fontWeight: 600, fontSize: '1rem' }}>정보가 저장되었습니다.</p>
        </div>
        <div className="pw-footer">
          <button type="button" className="pw-submit pw-submit--on" onClick={onBack}>확인</button>
        </div>
      </div>
    )
  }

  return (
    <div className="pw-page">
      <header className="pw-header">
        <button type="button" className="pw-back" aria-label="뒤로가기" onClick={onBack}>
          <ArrowLeftIcon />
        </button>
        <h2 className="pw-title">회원정보 변경</h2>
      </header>

      <div className="pw-body">
        <p className="pw-hint">변경할 항목만 입력하세요.</p>
        <div className="pw-field">
          <label className="pw-label">이름</label>
          <input className="pw-input" type="text" placeholder="새 이름" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="pw-field">
          <label className="pw-label">닉네임</label>
          <input className="pw-input" type="text" placeholder="새 닉네임" value={nickname} onChange={e => setNickname(e.target.value)} />
        </div>
        <div className="pw-field">
          <label className="pw-label">이메일</label>
          <input className="pw-input" type="email" placeholder="새 이메일" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="pw-field">
          <label className="pw-label">성별</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="button" className={`pw-input${gender === 'MALE' ? ' pw-submit--on' : ''}`} style={{ flex: 1 }} onClick={() => setGender(g => g === 'MALE' ? '' : 'MALE')}>남성</button>
            <button type="button" className={`pw-input${gender === 'FEMALE' ? ' pw-submit--on' : ''}`} style={{ flex: 1 }} onClick={() => setGender(g => g === 'FEMALE' ? '' : 'FEMALE')}>여성</button>
          </div>
        </div>
        <div className="pw-field">
          <label className="pw-label">생년월일</label>
          <input className="pw-input" type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
        </div>
        {error && <p style={{ color: '#b42318', fontSize: '0.85rem', marginTop: 8 }}>{error}</p>}
      </div>

      <div className="pw-footer">
        <button
          type="button"
          className={`pw-submit${canSubmit ? ' pw-submit--on' : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {saving ? '저장 중...' : '변경하기'}
        </button>
        <button type="button" className="pw-back-btn" onClick={onBack}>뒤로가기</button>
      </div>
    </div>
  )
}
