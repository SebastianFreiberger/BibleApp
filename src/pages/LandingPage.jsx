import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLang } from '../context'
import { useTheme } from '../hooks'
import { fetchVerse } from '../services/bibleApi'
import { Footer } from '../components'
import { YMTLogo } from '../components/YMTLogo'
import {
  CalendarHeart, MessageCircleHeart, Library, Crown,
  BookOpen, Heart, Star, ArrowRight, ArrowUp,
  UserPlus, ChevronDown, BookMarked, Flame, Share2
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
    icon: Flame,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    titleEs: 'Rachas diarias',
    titleEn: 'Daily streaks',
    descEs: 'Mantené tu constancia con rachas diarias y volvé cada día a la Palabra.',
    descEn: 'Stay consistent with daily streaks and return to the Word every day.',
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
    icon: Heart,
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.1)',
    titleEs: 'Guardá tus favoritos',
    titleEn: 'Save your favorites',
    descEs: 'Marcá los versículos que más te tocan y encontralos siempre desde tu perfil.',
    descEn: 'Bookmark the verses that touch you most and find them anytime from your profile.',
  },
  {
    icon: Share2,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)',
    titleEs: 'Compartí tu fe',
    titleEn: 'Share your faith',
    descEs: 'Enviá el versículo que te llegó al corazón a quien más querés, en un solo tap.',
    descEn: 'Send the verse that moved your heart to the people you love, in just one tap.',
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
  { q: '¿Necesito internet?', a: 'Sí, YMT carga los versículos en tiempo real desde nuestra base de datos.' },
  { q: '¿Puedo cambiar la versión bíblica?', a: 'Sí, podés elegir entre RV1960, NVI, LBLA y más desde cualquier pantalla.' },
  { q: '¿Mis favoritos se guardan?', a: 'Sí, quedan guardados en tu cuenta y podés verlos desde tu perfil.' },
]

const FAQ_EN = [
  { q: 'Is it free?', a: 'Yes, completely free. No ads, no hidden fees.' },
  { q: 'Do I need internet?', a: 'Yes, YMT loads verses in real time from our database.' },
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

  useEffect(() => {
    if (!localStorage.getItem('theme')) setTheme('dark')
  }, [])

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
          <YMTLogo size={28} />
          <span>YourMessageToday</span>
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
          <YMTLogo size={90} showTagline className="landing-hero-logo" />
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

      {/* ── Story ── */}
      <section className="landing-story">
        <div className="landing-story-inner">
          <p className="landing-story-eyebrow">
            {es ? 'El nombre lo dice todo' : 'The name says it all'}
          </p>
          <h2 className="landing-story-name">Your Message Today</h2>
          <div className="landing-story-abbr">
            <span>Y</span><span>M</span><span>T</span>
          </div>
          <div className="landing-story-body">
            {es ? (
              <>
                <p>
                  El nombre no es casualidad. Cada día, en el momento exacto, existe un versículo
                  que no fue escrito para todos — fue escrito para <em>vos</em>.
                  El que necesitás hoy. El que habla a lo que estás viviendo ahora.
                </p>
                <p>
                  YMT nació de una convicción simple pero profunda: la Palabra de Dios
                  no es un texto del pasado guardado en un libro polvoriento.
                  Es un mensaje <em>vivo</em>, presente y personal —
                  y hoy, en este momento, tiene algo que decirte a vos.
                </p>
                <p className="landing-story-closing">
                  Cada mañana trae un mensaje nuevo. Cada búsqueda, una respuesta.
                  Cada favorito guardado, un recordatorio de que fuiste encontrado por algo más grande.
                </p>
              </>
            ) : (
              <>
                <p>
                  The name is no coincidence. Every day, at the exact right moment,
                  there's a verse that wasn't written for everyone — it was written for <em>you</em>.
                  The one you need today. The one that speaks to what you're living right now.
                </p>
                <p>
                  YMT was born from a simple but profound conviction: God's Word is not
                  a text from the past sitting in a dusty book.
                  It is a <em>living</em>, present, personal message —
                  and today, in this very moment, it has something to say to you.
                </p>
                <p className="landing-story-closing">
                  Every morning brings a new message. Every search, an answer.
                  Every verse saved, a reminder that you were found by something greater.
                </p>
              </>
            )}
          </div>
          <div className="landing-story-quote-mark">"</div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features">
        <h2 className="landing-section-title">
          {es ? '¿Qué encontrás en YMT?' : "What's in YMT?"}
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
