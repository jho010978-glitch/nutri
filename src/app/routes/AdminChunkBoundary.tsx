import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { failed: boolean }

// lazy() 청크 로드 실패(배포로 해시가 바뀐 탭·네트워크 끊김) 시 트리 전체가
// 언마운트되는 것을 막는다. 정적 import에는 없던 실패 경로라 경계가 필요하다.
export class AdminChunkBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="admin-chunk-error" role="alert">
        <p>대시보드를 불러오지 못했습니다.</p>
        <button type="button" onClick={() => window.location.reload()}>
          새로고침
        </button>
      </div>
    )
  }
}
