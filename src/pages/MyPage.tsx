import { Typography } from '../components/Typography'
import { useMyPageQuery } from '../queries/myPageQueries'
import './MyPage.css'

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15.7 5.3a1 1 0 0 1 0 1.4L10.41 12l5.3 5.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.42 0Z" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.3 18.7a1 1 0 0 1 0-1.4l5.29-5.3L8.3 6.7a1 1 0 1 1 1.4-1.4l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0Z" />
  </svg>
)

const UserAvatarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12.8a4.4 4.4 0 1 0-4.4-4.4 4.4 4.4 0 0 0 4.4 4.4Zm0 2.2c-4.2 0-7.6 2.3-7.6 5.1a1 1 0 0 0 1 1h13.2a1 1 0 0 0 1-1c0-2.8-3.4-5.1-7.6-5.1Z" />
  </svg>
)

const LoadingBlock = () => (
  <div className="mypage-feedback" role="status" aria-live="polite">
    <Typography as="span" variant="label" weight="regular" color="#757575">
      마이페이지 정보를 불러오는 중...
    </Typography>
  </div>
)

const ErrorBlock = () => (
  <div className="mypage-feedback mypage-feedback-error" role="alert">
    <Typography as="span" variant="label" weight="regular" color="#b42318">
      마이페이지 정보를 불러오지 못했습니다.
    </Typography>
  </div>
)

export const MyPage = () => {
  const myPageQuery = useMyPageQuery()

  return (
    <section className="mypage" aria-label="마이페이지">
      <Typography as="h2" className="mypage-page-title" variant="pageTitle" color="#969696">
        마이페이지
      </Typography>

      <section className="mypage-panel">
        <header className="mypage-head-row">
          <button type="button" className="mypage-icon-btn" aria-label="뒤로가기">
            <ArrowLeftIcon />
          </button>
          <Typography as="h3" variant="sectionTitle" color="#111">
            마이페이지
          </Typography>
        </header>

        {myPageQuery.isLoading ? <LoadingBlock /> : null}
        {myPageQuery.isError ? <ErrorBlock /> : null}

        {myPageQuery.data ? (
          <>
            <section className="mypage-profile" aria-label="사용자 프로필">
              <div className="mypage-avatar" aria-hidden="true">
                <UserAvatarIcon />
              </div>
              <div className="mypage-profile-name-wrap">
                <Typography as="strong" variant="pageTitle" className="mypage-profile-name" color="#111">
                  {myPageQuery.data.member.name}
                </Typography>
                <span className="mypage-edit-icon" aria-hidden="true">
                  ✎
                </span>
              </div>
            </section>

            <section className="mypage-block" aria-label="회원 정보">
              <div className="mypage-block-head">
                <Typography as="h4" variant="sectionTitle" color="#111">
                  회원정보
                </Typography>
                <button type="button" className="mypage-link-btn">
                  회원정보 변경
                  <ChevronRightIcon />
                </button>
              </div>

              <dl className="mypage-info-list">
                <div className="mypage-info-item">
                  <dt>이름</dt>
                  <dd>{myPageQuery.data.member.name}</dd>
                </div>
                <div className="mypage-info-item">
                  <dt>생년월일</dt>
                  <dd>{myPageQuery.data.member.birthDate}</dd>
                </div>
                <div className="mypage-info-item">
                  <dt>연락처</dt>
                  <dd>{myPageQuery.data.member.phone}</dd>
                </div>
              </dl>
            </section>

            <section className="mypage-block" aria-label="찜한 상품">
              <div className="mypage-block-head">
                <Typography as="h4" variant="sectionTitle" color="#111">
                  찜한 상품
                </Typography>
                <button type="button" className="mypage-link-btn">
                  찜 목록 전체보기
                  <ChevronRightIcon />
                </button>
              </div>

              <ul className="mypage-saved-list" aria-label="찜한 상품 리스트">
                {myPageQuery.data.savedProducts.map((product) => (
                  <li key={product.id} className="mypage-saved-item">
                    <img src={product.imageUrl} alt={product.name} loading="lazy" />
                  </li>
                ))}
              </ul>
            </section>

            <section className="mypage-block" aria-label="영양 정보">
              <div className="mypage-block-head mypage-single-row">
                <Typography as="h4" variant="sectionTitle" color="#111">
                  영양정보
                </Typography>
                <button type="button" className="mypage-link-btn">
                  영양정보 변경
                  <ChevronRightIcon />
                </button>
              </div>
            </section>

            <section className="mypage-block mypage-menu-block" aria-label="마이페이지 메뉴">
              <button type="button" className="mypage-menu-row">
                저장된 비교항목
                <ChevronRightIcon />
              </button>
              <button type="button" className="mypage-menu-row">비밀번호 변경</button>
              <button type="button" className="mypage-menu-row">로그아웃</button>
              <button type="button" className="mypage-menu-row">회원탈퇴</button>
            </section>
          </>
        ) : null}
      </section>
    </section>
  )
}
