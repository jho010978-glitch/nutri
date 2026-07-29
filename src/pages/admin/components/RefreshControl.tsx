import { Typography } from '../../../components/Typography'

type RefreshControlProps = {
  autoRefresh: boolean
  onToggleAutoRefresh: (next: boolean) => void
  onRefresh: () => void
  refreshedAt: number
}

const formatTime = (ts: number) => {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export const RefreshControl = ({ autoRefresh, onToggleAutoRefresh, onRefresh, refreshedAt }: RefreshControlProps) => (
  <div className="admin-refresh">
    <button type="button" className="admin-refresh-btn" onClick={onRefresh}>
      새로고침
    </button>
    <label className="admin-refresh-toggle">
      <input
        type="checkbox"
        checked={autoRefresh}
        onChange={(e) => onToggleAutoRefresh(e.target.checked)}
      />
      60초 자동
    </label>
    <Typography as="span" variant="label" weight="regular" className="admin-refresh-ago">
      {formatTime(refreshedAt)} 업데이트
    </Typography>
  </div>
)
