import { useSearchParams } from 'react-router-dom'
import { Layout } from '../components'
import { Heart, BookOpen, Users, Sparkles, Target, Globe } from 'lucide-react'

const CONTENT = {
  es: {
    title: 'Quienes Somos',
    subtitle: 'Llevando la Palabra de Dios al mundo digital',
    intro: 'Somos un ministerio cristiano digital comprometido con llevar esperanza, consuelo y la verdad de las Escrituras a cada persona, sin importar dónde se encuentre.',
    values: [
      {
        icon: BookOpen,
        title: 'Fundamentados en la Palabra',
        text: 'Cada versículo, cada reflexión y cada recurso que ofrecemos está basado fielmente en la Biblia, la Palabra infalible de Dios.'
      },
      {
        icon: Heart,
        title: 'Amor Incondicional',
        text: 'Creemos que el amor de Dios transforma vidas. Nuestro propósito es reflejar ese amor en todo lo que hacemos.'
      },
      {
        icon: Users,
        title: 'Comunidad de Fe',
        text: 'No caminamos solos. Somos parte del cuerpo de Cristo y buscamos edificar una comunidad que se sostenga mutuamente en la fe.'
      },
      {
        icon: Globe,
        title: 'Alcance Global',
        text: 'La tecnología nos permite llevar el mensaje de salvación a cada rincón del mundo, en español e inglés.'
      },
      {
        icon: Target,
        title: 'Propósito Claro',
        text: 'Nuestro único objetivo es glorificar a Dios y ayudar a las personas a crecer en su relación personal con Él.'
      },
      {
        icon: Sparkles,
        title: 'Innovación con Propósito',
        text: 'Usamos la tecnología como herramienta al servicio del Reino, creando experiencias digitales que acercan a las personas a Dios.'
      }
    ],
    verse: '"Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos."',
    verseRef: '— Mateo 18:20'
  },
  en: {
    title: 'About Us',
    subtitle: 'Bringing God\'s Word to the digital world',
    intro: 'We are a digital Christian ministry committed to bringing hope, comfort, and the truth of Scripture to every person, no matter where they are.',
    values: [
      {
        icon: BookOpen,
        title: 'Grounded in the Word',
        text: 'Every verse, reflection, and resource we offer is faithfully based on the Bible, the infallible Word of God.'
      },
      {
        icon: Heart,
        title: 'Unconditional Love',
        text: 'We believe God\'s love transforms lives. Our purpose is to reflect that love in everything we do.'
      },
      {
        icon: Users,
        title: 'Community of Faith',
        text: 'We don\'t walk alone. We are part of the body of Christ and seek to build a community that supports each other in faith.'
      },
      {
        icon: Globe,
        title: 'Global Reach',
        text: 'Technology allows us to bring the message of salvation to every corner of the world, in Spanish and English.'
      },
      {
        icon: Target,
        title: 'Clear Purpose',
        text: 'Our sole objective is to glorify God and help people grow in their personal relationship with Him.'
      },
      {
        icon: Sparkles,
        title: 'Innovation with Purpose',
        text: 'We use technology as a tool in service of the Kingdom, creating digital experiences that draw people closer to God.'
      }
    ],
    verse: '"For where two or three gather in my name, there am I with them."',
    verseRef: '— Matthew 18:20'
  }
}

export function AboutPage() {
  const [searchParams] = useSearchParams()
  const lang = searchParams.get('lang') || 'es'
  const t = CONTENT[lang] || CONTENT.es

  return (
    <Layout lang={lang}>
      <div className="info-page">
        <div className="info-hero">
          <Users size={48} className="info-hero-icon" />
          <h1>{t.title}</h1>
          <p className="info-subtitle">{t.subtitle}</p>
        </div>

        <p className="info-intro">{t.intro}</p>

        <div className="info-grid">
          {t.values.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="info-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="info-card-icon">
                  <Icon size={28} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            )
          })}
        </div>

        <div className="info-verse-block">
          <p className="info-verse-text">{t.verse}</p>
          <p className="info-verse-ref">{t.verseRef}</p>
        </div>
      </div>
    </Layout>
  )
}
