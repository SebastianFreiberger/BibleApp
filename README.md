# Your Message Today (YMT)

Aplicación bíblica web que acompaña al usuario según cómo se siente: describe tu estado de ánimo en texto libre, una IA lo clasifica en categorías emocionales y la app responde con versículos bíblicos relevantes. Incluye versículo del día, favoritos, racha de uso, perfil con preferencias y soporte bilingüe (es/en).

## Demo

- App: [bibleapp-proyect.netlify.app](https://bibleapp-proyect.netlify.app/)
- No hay cuenta de demo pública: podés registrarte con tu propio email desde la app.

## Funcionalidades

- **Búsqueda por estado de ánimo**: el usuario escribe cómo se siente en lenguaje natural; el texto se clasifica contra un set de categorías emocionales (tristeza, ansiedad, gratitud, duelo, etc.) usando IA (vía una Netlify Function, ver abajo), con un fallback de búsqueda difusa (Fuse.js) si la IA no está disponible.
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
- [Netlify Functions](https://docs.netlify.com/functions/overview/) + [Groq](https://groq.com/) para la clasificación de estado de ánimo por IA, manteniendo la API key en el servidor
- [Fuse.js](https://www.fusejs.io/) para búsqueda difusa (fallback local si la IA no responde)
- [lucide-react](https://lucide.dev/) para iconografía
- [ESLint 9](https://eslint.org/) para linting

## Arquitectura del proyecto

```
src/
  pages/        Vistas enrutadas (landing, login, registro, home, biblia, búsqueda, perfil, atributos, reset password)
  components/   Componentes compartidos (header, navbar, footer, cards, layout)
  context/      Estado global: Auth, Idioma, Tema (React Context)
  hooks/        Lógica reutilizable (favoritos, racha, versículo diario, búsqueda por mood, tema)
  services/     Integraciones externas: Supabase, API de Biblia, Groq (vía Netlify Function)
  data/         Datos estáticos: libros de la Biblia, atributos de Dios, referencias por mood, traducciones (i18n)
netlify/
  functions/    Funciones serverless (classify-mood: clasifica el estado de ánimo con Groq, con la API key del lado del servidor)
```

## Correr el proyecto localmente

**Requisitos**: Node.js 18+, una cuenta de [Supabase](https://supabase.com/) y, opcionalmente, una API key de [Groq](https://console.groq.com/) para la búsqueda por estado de ánimo.

```bash
npm install
cp .env.example .env   # completar con tus propias credenciales
npm run dev
```

`npm run dev` levanta solo Vite: la UI funciona completa, pero la búsqueda por ánimo usa únicamente el fallback local (Fuse.js), ya que la Netlify Function no corre ahí. Para probar la clasificación por IA en local, instalá la [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm i -g netlify-cli`) y corré `netlify dev` en su lugar — sirve la app y las funciones juntas.

### Variables de entorno

Ver [`.env.example`](./.env.example). Las que empiezan con `VITE_` las lee Vite en build time y terminan visibles en el bundle del cliente — por eso `GROQ_API_KEY` (sin ese prefijo) solo la lee la Netlify Function del lado del servidor, nunca el navegador.

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

Configurado para [Netlify](https://netlify.com) (`netlify.toml`: build `npm run build`, publish `dist`, redirect SPA, funciones en `netlify/functions`). Las variables de entorno deben cargarse también en Netlify (Site configuration → Environment variables): las `VITE_*` y además `GROQ_API_KEY` (esta última marcada como solo para la función, nunca para el build del cliente).
