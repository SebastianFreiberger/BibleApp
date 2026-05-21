import { useState, useRef, useEffect } from 'react'
import { BookOpen, ChevronDown, Check } from 'lucide-react'
import { useLang } from '../context/LangContext'
import { BIBLE_VERSIONS } from '../data/bibleData'

export function VersionSelector({ t }) {
  const { lang, bibleVersion, setBibleVersion } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const versions = BIBLE_VERSIONS[lang] || []
  const current = versions.find(v => v.code === bibleVersion) || versions[0]

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (code) => {
    setBibleVersion(code)
    setOpen(false)
  }

  return (
    <div className="version-dropdown" ref={ref}>
      <button
        className={'version-trigger ' + (open ? 'open' : '')}
        onClick={() => setOpen(o => !o)}
        title={t.bibleVersionLabel}
      >
        <BookOpen size={13} />
        <span className="version-name">{current?.name || bibleVersion}</span>
        <ChevronDown size={13} className={'version-chevron ' + (open ? 'rotated' : '')} />
      </button>

      {open && (
        <div className="version-menu">
          <p className="version-menu-label">{t.bibleVersionLabel}</p>
          {versions.map(v => (
            <button
              key={v.code}
              className={'version-option ' + (v.code === bibleVersion ? 'active' : '')}
              onClick={() => handleSelect(v.code)}
            >
              <span className="version-option-short">{v.shortName}</span>
              <span className="version-option-full">{v.name}</span>
              {v.code === bibleVersion && <Check size={14} className="version-check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
