import { NavBar } from './NavBar'
import { useLang } from '../context/LangContext'

export function Layout({ children }) {
  const { lang } = useLang()

  return (
    <>
      <NavBar lang={lang} />
      <div className="layout-content">
        {children}
      </div>
    </>
  )
}
