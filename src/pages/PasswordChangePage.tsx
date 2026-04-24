import { useState } from 'react'
import './PasswordChangePage.css'

type Props = { onBack: () => void }

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22">
    <path d="M15.7 5.3a1 1 0 0 1 0 1.4L10.41 12l5.3 5.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.42 0Z" fill="#111"/>
  </svg>
)

export const PasswordChangePage = ({ onBack }: Props) => {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const canSubmit = current.length >= 8 && next.length >= 8 && confirm === next

  const handleSubmit = () => {
    if (!canSubmit) return
    // TODO: API 연동
    alert('비밀번호가 변경되었습니다.')
    onBack()
  }

  return (
    <div className="pw-page">
      <header className="pw-header">
        <button type="button" className="pw-back" aria-label="뒤로가기" onClick={onBack}>
          <ArrowLeftIcon />
        </button>
        <h2 className="pw-title">비밀번호 변경</h2>
      </header>

      <div className="pw-body">
        <div className="pw-field">
          <label className="pw-label">기존 비밀번호</label>
          <input
            className="pw-input"
            type="password"
            placeholder="8자 이상"
            value={current}
            onChange={e => setCurrent(e.target.value)}
          />
        </div>
        <div className="pw-field">
          <label className="pw-label">새 비밀번호</label>
          <input
            className="pw-input"
            type="password"
            placeholder="8자 이상"
            value={next}
            onChange={e => setNext(e.target.value)}
          />
        </div>
        <div className="pw-field">
          <label className="pw-label">비밀번호 확인</label>
          <input
            className="pw-input"
            type="password"
            placeholder="8자 이상"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
        </div>
      </div>

      <div className="pw-footer">
        <button
          type="button"
          className={`pw-submit${canSubmit ? ' pw-submit--on' : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          변경하기
        </button>
        <button type="button" className="pw-back-btn" onClick={onBack}>
          뒤로가기
        </button>
      </div>
    </div>
  )
}
