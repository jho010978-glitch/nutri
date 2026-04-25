import { createContext, useCallback, useContext, useState } from 'react'
import { addLike, removeLike } from '../api/likes'

type FavoritesContextValue = {
  favorites: Set<number>
  toggle: (id: number) => void
  isFavorite: (id: number) => boolean
  setFavoriteIds: (ids: number[]) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const setFavoriteIds = useCallback((ids: number[]) => {
    setFavorites(new Set(ids))
  }, [])

  const toggle = useCallback((id: number) => {
    const isCurrentlyFavorited = favorites.has(id)
    // 낙관적 업데이트
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    // 서버 동기화 (실패 시 롤백)
    const apiCall = isCurrentlyFavorited ? removeLike(id) : addLike(id)
    apiCall.catch(() => {
      setFavorites(prev => {
        const next = new Set(prev)
        if (isCurrentlyFavorited) next.add(id)
        else next.delete(id)
        return next
      })
    })
  }, [favorites])

  const isFavorite = useCallback((id: number) => favorites.has(id), [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite, setFavoriteIds }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider')
  return ctx
}
