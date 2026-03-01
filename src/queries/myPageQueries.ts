import { useQuery } from '@tanstack/react-query'
import { myPageDataProvider } from '../api/mypage/client'

const myPageKeys = {
  all: ['my-page'] as const,
  profile: () => [...myPageKeys.all, 'profile'] as const,
}

export const useMyPageQuery = () =>
  useQuery({
    queryKey: myPageKeys.profile(),
    queryFn: () => myPageDataProvider.getMyPage(),
  })
