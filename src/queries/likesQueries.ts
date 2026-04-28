import { useQuery } from '@tanstack/react-query'
import { getLikes } from '../api/likes'
import { useFavorites } from '../contexts/FavoritesContext'
import { useEffect } from 'react'

export const likesKeys = {
  list: (page: number, size: number) => ['likes', page, size] as const,
}

export const useLikesQuery = (enabled = true, page = 1, size = 20) => {
  const { setFavoriteIds } = useFavorites()
  const query = useQuery({
    queryKey: likesKeys.list(page, size),
    queryFn: () => getLikes(page, size),
    enabled,
  })

  useEffect(() => {
    if (query.data) {
      setFavoriteIds(query.data.items.map(i => i.productId))
    }
  }, [query.data, setFavoriteIds])

  return query
}
