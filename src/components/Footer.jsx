import { API_CONFIG } from '../data'

export function Footer({ lang, t }) {
  return (
    <footer className="footer">
      <p>{t.footer}</p>
      <p className="api-credit">{API_CONFIG[lang].credit}</p>
    </footer>
  )
}
