import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLang } from '../context'
import { useTheme } from '../hooks'
import { fetchVerse } from '../services/bibleApi'
import { Footer } from '../components'
import {
  CalendarHeart, MessageCircleHeart, Library, Crown,
  BookOpen, Heart, Star, ArrowRight, ArrowUp,
  UserPlus, ChevronDown, NotebookPen, BookMarked, Flame, Share2
} from 'lucide-react'

const DAILY_REF_ES = 'Isaias:33:2'
const DAILY_REF_EN = 'Isaiah:33:2'

const FEATURES = [
  {
    icon: CalendarHeart,
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.1)',
    titleEs: 'Versículo del Día',
    titleEn: 'Verse of the Day',
    descEs: 'Cada mañana un mensaje fresco de la Palabra para empezar tu día con fe.',
    descEn: 'Every morning a fresh message from the Word to start your day with faith.',
  },
  {
    icon: MessageCircleHeart,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    titleEs: '¿Cómo te sentís?',
    titleEn: 'How are you feeling?',
    descEs: 'Encontrá versículos según tu estado de ánimo: paz, esperanza, fortaleza y más.',
    descEn: 'Find verses for your mood: peace, hope, strength and more.',
  },
  {
    icon: Crown,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    titleEs: 'Conocé a Dios',
    titleEn: 'Know God',
    descEs: 'Explorá los atributos de Dios y descubrí su carácter a través de su Palabra.',
    descEn: 'Explore God\'s attributes and discover His character through His Word.',
  },
  {
    icon: Library,
    color: '#667eea',
    bg: 'rgba(102,126,234,0.1)',
    titleEs: 'La Biblia completa',
    titleEn: 'The Full Bible',
    descEs: 'Lee la Biblia libro por libro, capítulo por capítulo, en múltiples versiones.',
    descEn: 'Read the Bible book by book, chapter by chapter, in multiple versions.',
  },
  {
    icon: NotebookPen,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)',
    titleEs: 'Notas en el calendario',
    titleEn: 'Calendar notes',
    descEs: 'Anotá reflexiones, oraciones o momentos importantes en tu calendario personal.',
    descEn: 'Jot down reflections, prayers or important moments in your personal calendar.',
  },
  {
    icon: BookMarked,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    titleEs: 'Planes de lectura',
    titleEn: 'Reading plans',
    descEs: 'Seguí planes bíblicos estructurados y avanzá a tu propio ritmo.',
    descEn: 'Follow structured Bible plans and progress at your own pace.',
  },
  {
    icon: Flame,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    titleEs: 'Rachas diarias',
    titleEn: 'Daily streaks',
    descEs: 'Mantené tu constancia con rachas diarias y volvé cada día a la Palabra.',
    descEn: 'Stay consistent with daily streaks and return to the Word every day.',
  },
  {
    icon: Share2,
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.1)',
    titleEs: 'Compartí tu fe',
    titleEn: 'Share your faith',
    descEs: 'Enviá versículos a tus amigos y seres queridos con un solo toque.',
    descEn: 'Send verses to your friends and loved ones with a single tap.',
  },
]


const STEPS = [
  {
    icon: UserPlus,
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    titleEs: 'Creá tu cuenta',
    titleEn: 'Create your account',
    descEs: 'Gratis, en segundos, sin tarjeta de crédito.',
    descEn: 'Free, in seconds, no credit card needed.',
  },
  {
    icon: BookOpen,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
    titleEs: 'Explorá la Biblia',
    titleEn: 'Explore the Bible',
    descEs: 'Leé por libro, buscá por ánimo o descubrí atributos de Dios.',
    descEn: 'Read by book, search by mood, or discover God\'s attributes.',
  },
  {
    icon: Heart,
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.1)',
    titleEs: 'Guardá tus favoritos',
    titleEn: 'Save your favorites',
    descEs: 'Marcá los versículos que más te tocan y accedé a ellos siempre.',
    descEn: 'Bookmark the verses that touch you most and find them anytime.',
  },
]

const FAQ_ES = [
  { q: '¿Es gratis?', a: 'Sí, completamente gratis. Sin publicidad, sin costos ocultos.' },
  { q: '¿Necesito internet?', a: 'Sí, BibleApp carga los versículos en tiempo real desde nuestra base de datos.' },
  { q: '¿Puedo cambiar la versión bíblica?', a: 'Sí, podés elegir entre RV1960, NVI, LBLA y más desde cualquier pantalla.' },
  { q: '¿Mis favoritos se guardan?', a: 'Sí, quedan guardados en tu cuenta y podés verlos desde tu perfil.' },
]

const FAQ_EN = [
  { q: 'Is it free?', a: 'Yes, completely free. No ads, no hidden fees.' },
  { q: 'Do I need internet?', a: 'Yes, BibleApp loads verses in real time from our database.' },
  { q: 'Can I change the Bible version?', a: 'Yes, choose from KJV, WEB, ASV and more from any screen.' },
  { q: 'Are my favorites saved?', a: 'Yes, they\'re stored in your account and accessible from your profile.' },
]

export function LandingPage() {
  const { lang, setLang } = useLang()
  const { setTheme } = useTheme()
  const es = lang === 'es'
  const [verse, setVerse] = useState(null)
  const [showTop, setShowTop] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => { setTheme('dark') }, [])

  useEffect(() => {
    const ref = es ? DAILY_REF_ES : DAILY_REF_EN
    fetchVerse(ref, lang, es ? 'RV1960' : 'web').then(setVerse)
  }, [lang])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const faq = es ? FAQ_ES : FAQ_EN

  return (
    <div className="landing">

      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav-brand">
          <img src="/images/logobibleapp.png" alt="BibleApp" className="landing-nav-logo" />
          <span>BibleApp</span>
        </div>
        <div className="landing-nav-center">
          <div className="lang-toggle">
            <button className={'lang-btn' + (lang === 'es' ? ' active' : '')} onClick={() => setLang('es')}>ES</button>
            <button className={'lang-btn' + (lang === 'en' ? ' active' : '')} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>
        <div className="landing-nav-end">
          <Link to="/login" className="landing-nav-login">
            {es ? 'Iniciar sesión' : 'Sign in'}
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero-bg">
          <div className="landing-orb landing-orb-1" />
          <div className="landing-orb landing-orb-2" />
          <div className="landing-orb landing-orb-3" />
        </div>
        <div className="landing-hero-content">
          <img src="/images/logobibleapp.png" alt="BibleApp logo" className="landing-hero-logo" />
          <h1 className="landing-hero-title">
            <span className="landing-hero-title-main">{es ? 'Tu Palabra' : 'Your Word'}</span>
            <span className="landing-hero-title-sub">{es ? 'de cada día' : 'every day'}</span>
          </h1>
          <p className="landing-hero-sub">
            {es
              ? <>Versículos, búsqueda por ánimo, atributos de Dios y la Biblia completa<br />Todo en un solo lugar.</>
              : <>Daily verses, mood search, God's attributes and the full Bible<br />All in one place.</>}
          </p>
          <div className="landing-hero-ctas">
            <Link to="/register" className="landing-cta-primary">
              {es ? 'Crear cuenta gratis' : 'Create free account'}
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="landing-cta-secondary">
              {es ? 'Ya tengo cuenta' : 'I have an account'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features">
        <h2 className="landing-section-title">
          {es ? '¿Qué encontrás en BibleApp?' : 'What\'s in BibleApp?'}
        </h2>
        <div className="landing-features-grid">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="landing-feature-card">
                <div className="landing-feature-icon" style={{ background: f.bg, color: f.color }}>
                  <Icon size={26} />
                </div>
                <h3>{es ? f.titleEs : f.titleEn}</h3>
                <p>{es ? f.descEs : f.descEn}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="landing-how">
        <h2 className="landing-section-title">
          {es ? '¿Cómo funciona?' : 'How does it work?'}
        </h2>
        <div className="landing-how-steps">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="landing-how-step">
                <div className="landing-how-num">{i + 1}</div>
                <div className="landing-how-icon" style={{ background: s.bg, color: s.color }}>
                  <Icon size={24} />
                </div>
                <h3>{es ? s.titleEs : s.titleEn}</h3>
                <p>{es ? s.descEs : s.descEn}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Verse preview ── */}
      <section className="landing-preview">
        <p className="landing-preview-label">
          <CalendarHeart size={15} />
          {es ? 'Versículo de hoy' : "Today's verse"}
        </p>
        {verse ? (
          <div className="landing-preview-card">
            <blockquote className="landing-preview-text">"{verse.text}"</blockquote>
            <cite className="landing-preview-ref">— {verse.reference}</cite>
          </div>
        ) : (
          <div className="landing-preview-card landing-preview-loading">
            <div className="spinner" />
          </div>
        )}
        <p className="landing-preview-hint">
          {es ? 'Registrate para guardar tus favoritos y mucho más' : 'Sign up to save your favorites and much more'}
        </p>
      </section>

      {/* ── FAQ ── */}
      <section className="landing-faq">
        <h2 className="landing-section-title">
          {es ? 'Preguntas frecuentes' : 'FAQ'}
        </h2>
        <div className="landing-faq-list">
          {faq.map((item, i) => (
            <div key={i} className={'landing-faq-item' + (openFaq === i ? ' open' : '')}>
              <button
                className="landing-faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{item.q}</span>
                <ChevronDown size={18} className="faq-chevron" />
              </button>
              {openFaq === i && (
                <p className="landing-faq-answer">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="landing-cta-section">
        <div className="landing-cta-box">
          <Star size={32} className="landing-cta-star" />
          <h2>{es ? 'Empezá hoy' : 'Start today'}</h2>
          <p>{es ? 'Gratis, sin tarjeta de crédito.' : 'Free, no credit card required.'}</p>
          <Link to="/register" className="landing-cta-primary large">
            {es ? 'Crear mi cuenta' : 'Create my account'}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Scroll to top ── */}
      {showTop && (
        <button
          className="landing-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={es ? 'Volver arriba' : 'Back to top'}
        >
          <span className="scroll-top-icon">
            <span className="scroll-top-front"><Crown size={20} /></span>
            <span className="scroll-top-back"><ArrowUp size={20} /></span>
          </span>
        </button>
      )}

    </div>
  )
}
