import { useEffect, useRef } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
let scriptPromise = null

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      script.defer = true
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

// Widget de Cloudflare Turnstile. La prop `resetKey` permite forzar un
// remount (y por lo tanto un token nuevo) después de un intento fallido,
// ya que cada token de Turnstile solo se puede usar una vez.
export function Turnstile({ siteKey, onVerify, onExpire, resetKey }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'expired-callback': () => onExpire?.(),
        'error-callback': () => onExpire?.(),
      })
    })
    return () => {
      cancelled = true
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, resetKey])

  return <div ref={containerRef} className="turnstile-widget" />
}
