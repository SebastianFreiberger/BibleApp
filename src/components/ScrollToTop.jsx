import { useState, useEffect } from 'react'
import { Crown, ArrowUp } from 'lucide-react'
import { useLang } from '../context/LangContext'

export function ScrollToTop() {
  const { lang } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      className="landing-scroll-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={lang === 'es' ? 'Volver arriba' : 'Back to top'}
    >
      <span className="scroll-top-icon">
        <span className="scroll-top-front"><Crown size={20} /></span>
        <span className="scroll-top-back"><ArrowUp size={20} /></span>
      </span>
    </button>
  )
}
