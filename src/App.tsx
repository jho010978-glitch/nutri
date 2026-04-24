import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { UserProfileSetupModal, type Profile } from './components/UserProfileSetupModal'
import { products as allProducts } from './mocks/products'
import { AdminPage } from './pages/AdminPage'
import { ComparePage } from './pages/ComparePage'
import { FilterPage } from './pages/FilterPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { PasswordChangePage } from './pages/PasswordChangePage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MyPage } from './pages/MyPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { SearchPage } from './pages/SearchPage'
import type { Product } from './types/product'

type RouteKey =
  | 'home' | 'search' | 'mypage' | 'login' | 'admin'
  | 'detail' | 'compare' | 'favorites' | 'password-change'

const validRoutes = new Set<RouteKey>([
  'home', 'search', 'mypage', 'login', 'admin',
  'detail', 'compare', 'favorites', 'password-change',
])

const getRouteFromHash = (): RouteKey => {
  const hash = window.location.hash.replace('#', '') as RouteKey
  return validRoutes.has(hash) ? hash : 'home'
}

const setHashRoute = (route: RouteKey) => { window.location.hash = route }

function App() {
  const [route, setRoute] = useState<RouteKey>(() => getRouteFromHash())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [showNutritionEdit, setShowNutritionEdit] = useState(false)
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [compareProducts, setCompareProducts] = useState<Product[]>([])

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash())
    if (!window.location.hash) setHashRoute('home')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (r: RouteKey) => { setRoute(r); setHashRoute(r) }

  const handleLogin = (nextAdmin = false) => {
    setIsAuthenticated(true)
    setIsAdmin(nextAdmin)
    setShowProfileSetup(true)
    navigate('home')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsAdmin(false)
    navigate('home')
  }

  const handleWithdraw = () => {
    setIsAuthenticated(false)
    setIsAdmin(false)
    setUserProfile(null)
    navigate('home')
  }

  const handleAddToCompare = (product: Product) => {
    setCompareProducts(prev => {
      if (prev.length === 0) return [product]
      if (prev[0].id === product.id) return prev
      return [prev[0], product]
    })
    navigate('compare')
  }

  const currentPage = useMemo(() => {
    switch (route) {
      case 'home':
        return (
          <HomePage
            onMoveToFilter={() => setShowFilter(true)}
            onMoveToMyPage={() => navigate('mypage')}
            onProductClick={product => { setSelectedProduct(product); navigate('detail') }}
            onAddToCompare={handleAddToCompare}
          />
        )
      case 'detail':
        return selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => { setSelectedProduct(null); navigate('home') }}
          />
        ) : null
      case 'search':
        return (
          <SearchPage
            onBack={() => navigate('home')}
            onProductClick={product => { setSelectedProduct(product); navigate('detail') }}
          />
        )
      case 'mypage':
        return (
          <MyPage
            isAuthenticated={isAuthenticated}
            onBack={() => navigate('home')}
            onLogin={() => navigate('login')}
            onGoFavorites={() => navigate('favorites')}
            onGoPasswordChange={() => navigate('password-change')}
            onLogout={handleLogout}
            onEditNutrition={() => setShowNutritionEdit(true)}
            onWithdraw={handleWithdraw}
          />
        )
      case 'login':
        return (
          <LoginPage
            onLogin={(nextAdmin) => handleLogin(nextAdmin)}
          />
        )
      case 'favorites':
        return (
          <FavoritesPage
            onBack={() => navigate('mypage')}
            onProductClick={product => { setSelectedProduct(product); navigate('detail') }}
          />
        )
      case 'password-change':
        return (
          <PasswordChangePage
            onBack={() => navigate('mypage')}
          />
        )
      case 'admin':
        return isAuthenticated && isAdmin
          ? <AdminPage />
          : <LoginPage onLogin={() => { setIsAuthenticated(true); setIsAdmin(true) }} />
      case 'compare': {
        let p0: Product, p1: Product
        if (compareProducts.length >= 2) {
          [p0, p1] = compareProducts as [Product, Product]
        } else if (compareProducts.length === 1) {
          p0 = compareProducts[0]
          p1 = allProducts.find(p => p.id !== p0.id) ?? allProducts[1]
        } else {
          p0 = allProducts[0]; p1 = allProducts[1]
        }
        return (
          <ComparePage
            products={[p0, p1]}
            onBack={() => navigate('home')}
          />
        )
      }
      default:
        return null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, isAuthenticated, isAdmin, selectedProduct, compareProducts])

  return (
    <FavoritesProvider>
      <main className="screen-wrap">
        <section className="mobile-page app-shell">
          {showProfileSetup && (
            <UserProfileSetupModal
              onClose={() => setShowProfileSetup(false)}
              onComplete={(profile) => {
                setUserProfile(profile)
                setShowProfileSetup(false)
              }}
            />
          )}
          {showNutritionEdit && (
            <UserProfileSetupModal
              initialProfile={userProfile ?? undefined}
              submitLabel="저장하기"
              onClose={() => setShowNutritionEdit(false)}
              onComplete={(profile) => {
                setUserProfile(profile)
                setShowNutritionEdit(false)
              }}
            />
          )}
          {showFilter && (
            <FilterPage onClose={() => setShowFilter(false)} />
          )}
          <section className="page-body">{currentPage}</section>
        </section>
      </main>
    </FavoritesProvider>
  )
}

export default App
