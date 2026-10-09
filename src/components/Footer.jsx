import { Crown, Heart } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/hooks'

export function Footer() {
  const { lang } = useLang()
  const es = lang === 'es'

  return (
    <footer className="landing-footer">
      <div className="landing-footer-center">
        <span className="landing-footer-brand">YourMessageToday</span>
        <Crown size={13} className="landing-footer-crown" />
        <span className="landing-footer-made">
          {es ? 'Hecho con' : 'Made with'}{' '}
          <Heart size={12} fill="currentColor" className="landing-footer-heart" />{' '}
          {es ? 'para tu fe' : 'for your faith'}
        </span>
        <Link to="/privacidad" className="landing-footer-privacy">
          {es ? 'Privacidad' : 'Privacy'}
        </Link>
      </div>
    </footer>
  )
}
