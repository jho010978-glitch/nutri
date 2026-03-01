import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { UserProfileSetupModal } from './components/UserProfileSetupModal'
import { products as allProducts } from './mocks/products'
import { AdminPage } from './pages/AdminPage'
import { ComparePage } from './pages/ComparePage'
import { FilterPage } from './pages/FilterPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MyPage } from './pages/MyPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { SearchPage } from './pages/SearchPage'
import type { Product } from './types/product'

type RouteKey = 'home' | 'search' | 'filter' | 'mypage' | 'login' | 'admin' | 'detail' | 'compare'

type RouteConfig = {
  key: RouteKey
  label: string
}

const routes: RouteConfig[] = [
  { key: 'home', label: '메인' },
  { key: 'search', label: '검색' },
  { key: 'filter', label: '필터' },
  { key: 'mypage', label: '마이' },
  { key: 'login', label: '로그인' },
  { key: 'admin', label: '관리자' },
  { key: 'compare', label: '비교' },
]

const validRouteSet = new Set<RouteKey>(routes.map((route) => route.key))

const getRouteFromHash = (): RouteKey => {
  const hash = window.location.hash.replace('#', '')
  if (validRouteSet.has(hash as RouteKey)) {
    return hash as RouteKey
  }
  return 'home'
}

const setHashRoute = (route: RouteKey): void => {
  window.location.hash = route
}

function App() {
  const [route, setRoute] = useState<RouteKey>(() => getRouteFromHash())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [compareProducts, setCompareProducts] = useState<Product[]>([])

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash())

    if (!window.location.hash) {
      setHashRoute('home')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleAddToCompare = (product: Product) => {
    setCompareProducts((prev) => {
      if (prev.length === 0) return [product]
      if (prev[0].id === product.id) return prev
      return [prev[0], product]
    })
    setRoute('compare')
    setHashRoute('compare')
  }

  const homePageNode = (
    <HomePage
      onMoveToFilter={() => setHashRoute('filter')}
      onMoveToMyPage={() => setHashRoute('mypage')}
      onProductClick={(product) => {
        setSelectedProduct(product)
        setRoute('detail')
      }}
      onAddToCompare={handleAddToCompare}
    />
  )

  const currentPage = useMemo(() => {
    switch (route) {
      case 'home':
        return homePageNode
      case 'detail':
        return selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => {
              setSelectedProduct(null)
              setRoute('home')
              setHashRoute('home')
            }}
            onAddToCompare={handleAddToCompare}
          />
        ) : homePageNode
      case 'search':
        return (
          <SearchPage
            onBack={() => setHashRoute('home')}
            onProductClick={(product) => {
              setSelectedProduct(product)
              setRoute('detail')
            }}
          />
        )
      case 'filter':
        return <FilterPage onBack={() => setHashRoute('home')} />
      case 'mypage':
        return isAuthenticated ? (
          <MyPage />
        ) : (
          <LoginPage onLogin={() => setIsAuthenticated(true)} />
        )
      case 'login':
        return (
          <LoginPage
            onLogin={(nextAdminState) => {
              setIsAuthenticated(true)
              setIsAdmin(nextAdminState)
              setShowProfileSetup(true)
              setHashRoute('home')
            }}
          />
        )
      case 'admin':
        return isAuthenticated && isAdmin ? (
          <AdminPage />
        ) : (
          <LoginPage
            onLogin={() => {
              setIsAuthenticated(true)
              setIsAdmin(true)
            }}
          />
        )
      case 'compare': {
        let p0: Product
        let p1: Product
        if (compareProducts.length >= 2) {
          ;[p0, p1] = compareProducts as [Product, Product]
        } else if (compareProducts.length === 1) {
          p0 = compareProducts[0]
          p1 = allProducts.find((p) => p.id !== p0.id) ?? allProducts[1]
        } else {
          p0 = allProducts[0]
          p1 = allProducts[1]
        }
        return (
          <ComparePage
            products={[p0, p1]}
            onBack={() => {
              setRoute('home')
              setHashRoute('home')
            }}
          />
        )
      }
      default:
        return homePageNode
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, isAuthenticated, isAdmin, selectedProduct, compareProducts])

  return (
    <main className="screen-wrap">
      <section className="mobile-page app-shell">
        {showProfileSetup && (
          <UserProfileSetupModal
            onClose={() => setShowProfileSetup(false)}
            onComplete={() => setShowProfileSetup(false)}
          />
        )}

<section className="page-body">{currentPage}</section>
      </section>
    </main>
  )
}

export default App
