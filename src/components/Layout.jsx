import { NavBar } from './NavBar'
import { useSearchParams } from 'react-router-dom'

export function Layout({ children, lang }) {
  const [searchParams] = useSearchParams()
  const currentLang = lang || searchParams.get('lang') || 'es'

  return (
    <>
      <NavBar lang={currentLang} />
      <div className="layout-content">
        {children}
      </div>
    </>
  )
}
