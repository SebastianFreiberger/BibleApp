# Your Message Today (YMT)

Aplicación bíblica web que acompaña al usuario según cómo se siente: describe tu estado de ánimo en texto libre, una IA lo clasifica en categorías emocionales y la app responde con versículos bíblicos relevantes. Incluye versículo del día, favoritos, racha de uso, perfil con preferencias y soporte bilingüe (es/en).

## Demo

- App: [bibleapp-proyect.netlify.app](https://bibleapp-proyect.netlify.app/)
- No hay cuenta de demo pública: podés registrarte con tu propio email desde la app.

## Funcionalidades

- **Búsqueda por estado de ánimo**: el usuario escribe cómo se siente en lenguaje natural; el texto se clasifica contra un set de categorías emocionales (tristeza, ansiedad, gratitud, duelo, etc.) usando IA, y se muestran versículos asociados a esas categorías.
- **Versículo del día** en la pantalla principal.
- **Atributos de Dios**: exploración de versículos organizados por atributo (fortaleza, amor, fidelidad, etc.).
- **Lectura de la Biblia** por libro/capítulo/versículo.
- **Favoritos**: guardar versículos, con detección de favoritos nuevos.
- **Racha de días** de uso consecutivo.
- **Autenticación** (registro, login, recuperación de contraseña) con perfil persistente (nombre, teléfono, avatar, tema, idioma, versión de Biblia preferida).
- **Tema claro/oscuro** e **i18n** (español/inglés).

## Stack técnico

- [React 19](https://react.dev/) + [Vite 7](https://vite.dev/) (`@vitejs/plugin-react-swc`)
- [React Router 7](https://reactrouter.com/) para ruteo
- [Supabase](https://supabase.com/) como backend: autenticación, base de datos Postgres (perfiles, favoritos, racha) y storage (avatares)
- Clasificación de estado de ánimo por IA: [Google Gemini](https://ai.google.dev/) y [Groq](https://groq.com/) (modelos LLM vía API)
- [Fuse.js](https://www.fusejs.io/) para búsqueda difusa
- [lucide-react](https://lucide.dev/) para iconografía
- [ESLint 9](https://eslint.org/) para linting

## Arquitectura del proyecto

```
src/
  pages/        Vistas enrutadas (landing, login, registro, home, biblia, búsqueda, perfil, atributos, reset password)
  components/   Componentes compartidos (header, navbar, footer, cards, layout)
  context/      Estado global: Auth, Idioma, Tema (React Context)
  hooks/        Lógica reutilizable (favoritos, racha, versículo diario, búsqueda por mood, tema)
  services/     Integraciones externas: Supabase, API de Biblia, Gemini, Groq
  data/         Datos estáticos: libros de la Biblia, atributos de Dios, referencias por mood, traducciones (i18n)
```

## Correr el proyecto localmente

**Requisitos**: Node.js 18+, una cuenta de [Supabase](https://supabase.com/) y, opcionalmente, API keys de [Google AI Studio](https://aistudio.google.com/) (Gemini) y [Groq](https://console.groq.com/) para la búsqueda por estado de ánimo.

```bash
npm install
cp .env.example .env   # completar con tus propias credenciales
npm run dev
```

### Variables de entorno

Ver [`.env.example`](./.env.example). Todas son requeridas por Vite en build time (prefijo `VITE_`), por lo que son visibles en el bundle del cliente — no poner ahí secretos que no puedan ser públicos (ver nota de seguridad abajo).

### Base de datos (Supabase)

El esquema completo (tablas, RLS y el trigger que crea el perfil al registrarse) está en [`supabase/schema.sql`](./supabase/schema.sql) — correrlo en el SQL Editor de un proyecto Supabase nuevo para recrear el backend desde cero.

Tablas en `public`:

- `profiles` (id uuid FK a `auth.users`, name, phone, avatar_url, lang, theme, bible_version, created_at)
- `favorites` (id, user_id FK, reference, text, version, created_at)
- `streak_days` (id, user_id FK, date)

Además hay que crear manualmente un bucket de storage público llamado `avatars` (Storage → New bucket) para las fotos de perfil.

Para que el login/registro y el reset de contraseña funcionen contra tu propio dominio, agregá su URL en Supabase → Authentication → URL Configuration (Site URL y Redirect URLs, con el path `/reset-password`).

## Scripts disponibles

| Comando           | Descripción                          |
|-------------------|---------------------------------------|
| `npm run dev`     | Servidor de desarrollo con HMR        |
| `npm run build`   | Build de producción (carpeta `dist`)  |
| `npm run preview` | Sirve el build de producción local    |
| `npm run lint`    | Corre ESLint sobre el proyecto        |

## Deploy

Configurado para [Netlify](https://netlify.com) (`netlify.toml`: build `npm run build`, publish `dist`, redirect SPA). Las variables de entorno deben cargarse también en Netlify (Site configuration → Environment variables), ya que no viajan por git.

## Nota de seguridad conocida

Las API keys de Gemini y Groq se usan hoy desde el cliente (`VITE_GEMINI_API_KEY`, `VITE_GROQ_API_KEY`), por lo que quedan expuestas en el bundle JS una vez deployado. Pendiente: mover la clasificación de estado de ánimo a una función serverless (Netlify Functions) que mantenga esas claves en el servidor.
