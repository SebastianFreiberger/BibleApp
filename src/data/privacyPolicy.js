// Contenido de la página de privacidad. Texto plano en vez de UI_TEXT porque
// son párrafos largos, no etiquetas cortas de interfaz.
export const PRIVACY_POLICY = {
  es: {
    updatedAt: '5 de octubre de 2026',
    intro: 'Your Message Today (YMT) es un proyecto personal para acompañarte con la Biblia según cómo te sentís. Esta página explica, en lenguaje simple, qué datos guardamos y para qué — sin letra chica.',
    sections: [
      {
        title: 'Qué datos guardamos',
        body: [
          'Cuando creás una cuenta: tu nombre, tu email y, si querés, tu teléfono (es opcional). Tu contraseña no la vemos nosotros en ningún momento — queda guardada encriptada por Supabase, el servicio que usamos para el login.',
          'Mientras usás la app: los versículos que marcás como favoritos, tu racha de días activos, el idioma, el tema (claro/oscuro) y la versión de Biblia que elegís, y tu foto de perfil si subís una.',
        ],
      },
      {
        title: 'El texto de "¿Cómo te sientes?"',
        body: [
          'Cuando escribís libremente cómo te sentís, ese texto se envía a un servicio externo de inteligencia artificial (Groq) para identificar la emoción y sugerirte versículos relacionados. No queda guardado en ningún lado ni vinculado a tu cuenta — se usa solo en el momento de la búsqueda.',
          'Si preferís no escribir nada, podés tocar directamente una de las categorías (tristeza, ansiedad, gratitud, etc.) y listo.',
        ],
      },
      {
        title: 'Con quién lo compartimos',
        body: [
          'Supabase: guarda la base de datos y maneja el login.',
          'Netlify: aloja la aplicación y el código que la hace funcionar.',
          'Groq: recibe el texto de "¿Cómo te sientes?" solo para clasificarlo (ver arriba).',
          'bolls.life y bible-api.com: reciben únicamente la referencia del versículo que pedís (por ejemplo "Juan 3:16"), nunca tu nombre, tu email ni ningún otro dato tuyo.',
          'No vendemos datos a nadie, no hay publicidad, y no hay rastreadores de terceros en la app.',
        ],
      },
      {
        title: 'Por qué lo guardamos',
        body: [
          'Para que la app funcione como esperás: que tus favoritos y tu racha te estén esperando la próxima vez que entrás, en el idioma y el tema que elegiste.',
        ],
      },
      {
        title: 'Cuánto tiempo lo guardamos',
        body: [
          'Mientras tu cuenta esté activa. Si la eliminás desde tu perfil, se desactiva al instante — tus favoritos y tu racha no se pierden, pero dejan de estar visibles. Si volvés a iniciar sesión más adelante, se reactiva sola.',
          'Si en cambio querés que borremos todo de forma definitiva y sin vuelta atrás, escribinos y lo hacemos.',
        ],
      },
      {
        title: 'Tus derechos',
        body: [
          'Podés ver y corregir tus datos en cualquier momento desde "Editar perfil". Podés eliminar tu cuenta desde la misma pantalla. Y podés pedirnos, cuando quieras, una copia de tus datos o que los borremos por completo.',
        ],
      },
      {
        title: 'Si sos menor de edad',
        body: [
          'Esta app está pensada para usarse con el acompañamiento de tus padres o de tus líderes si sos menor de edad. Si tenés menos de 13 años, pedile a un adulto que te ayude a crear la cuenta.',
        ],
      },
      {
        title: 'Seguridad',
        body: [
          'Toda la conexión va encriptada (HTTPS). Las contraseñas nunca se guardan en texto plano. Y cada usuario solo puede ver y modificar sus propios datos — está técnicamente impedido de ver los de otra persona.',
        ],
      },
      {
        title: 'Cambios a este aviso',
        body: [
          'Si algo importante cambia en cómo manejamos tus datos, lo vamos a avisar acá mismo, en esta página.',
        ],
      },
      {
        title: 'Contacto',
        body: [
          '¿Dudas, pedido de tus datos, o querés que eliminemos todo? Escribinos a s.freiberger@positive.fit.',
        ],
      },
    ],
  },
  en: {
    updatedAt: 'October 5, 2026',
    intro: 'Your Message Today (YMT) is a personal project to walk alongside you in Scripture based on how you feel. This page explains, in plain language, what data we keep and why — no fine print.',
    sections: [
      {
        title: 'What we keep',
        body: [
          "When you create an account: your name, your email and, if you want, your phone number (it's optional). We never see your password — it's stored encrypted by Supabase, the service we use for login.",
          'While you use the app: the verses you mark as favorites, your streak of active days, your chosen language, theme (light/dark) and Bible version, and your profile picture if you upload one.',
        ],
      },
      {
        title: 'The text from "How are you feeling?"',
        body: [
          'When you freely type how you feel, that text is sent to a third-party AI service (Groq) to identify the emotion and suggest related verses. It is never stored anywhere or linked to your account — it\'s only used at the moment of the search.',
          'If you\'d rather not type anything, you can just tap one of the categories (sadness, anxiety, gratitude, etc.) instead.',
        ],
      },
      {
        title: 'Who we share it with',
        body: [
          'Supabase: stores the database and handles login.',
          'Netlify: hosts the app and the code that runs it.',
          'Groq: receives the "How are you feeling?" text only to classify it (see above).',
          'bolls.life and bible-api.com: receive only the verse reference you request (e.g. "John 3:16"), never your name, email, or any other personal data.',
          "We don't sell data to anyone, there's no advertising, and no third-party trackers in the app.",
        ],
      },
      {
        title: 'Why we keep it',
        body: [
          'So the app works the way you expect: your favorites and streak are there the next time you open it, in the language and theme you chose.',
        ],
      },
      {
        title: 'How long we keep it',
        body: [
          "While your account is active. If you delete it from your profile, it's deactivated instantly — your favorites and streak aren't lost, but they stop being visible. If you log back in later, it reactivates on its own.",
          "If you'd rather we erase everything permanently with no way back, just reach out and we'll do it.",
        ],
      },
      {
        title: 'Your rights',
        body: [
          'You can view and correct your data anytime from "Edit profile." You can delete your account from the same screen. And you can ask us, whenever you want, for a copy of your data or to have it permanently erased.',
        ],
      },
      {
        title: 'If you are a minor',
        body: [
          "This app is meant to be used with the support of your parents or your youth leaders if you're a minor. If you're under 13, please ask an adult to help you create the account.",
        ],
      },
      {
        title: 'Security',
        body: [
          "The whole connection is encrypted (HTTPS). Passwords are never stored in plain text. And each user can only see and change their own data — they're technically prevented from seeing anyone else's.",
        ],
      },
      {
        title: 'Changes to this notice',
        body: [
          "If anything important changes in how we handle your data, we'll announce it right here on this page.",
        ],
      },
      {
        title: 'Contact',
        body: [
          'Questions, a data request, or want everything deleted? Write to us at s.freiberger@positive.fit.',
        ],
      },
    ],
  },
}
