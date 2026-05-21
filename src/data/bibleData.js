// Versiones disponibles por idioma
export const BIBLE_VERSIONS = {
  es: [
    { code: 'RV1960', name: 'Reina Valera 1960',           shortName: 'RV1960' },
    { code: 'NVI',    name: 'Nueva Versión Internacional',  shortName: 'NVI'    },
    { code: 'LBLA',   name: 'La Biblia de las Américas',   shortName: 'LBLA'   },
    { code: 'NTV',    name: 'Nueva Traducción Viviente',    shortName: 'NTV'    },
    { code: 'PDT',    name: 'Palabra de Dios para Todos',  shortName: 'PDT'    },
  ],
  en: [
    { code: 'web', name: 'World English Bible',  shortName: 'WEB' },
    { code: 'kjv', name: 'King James Version',   shortName: 'KJV' },
    { code: 'bbe', name: 'Bible in Basic English', shortName: 'BBE' },
  ]
}

export const DEFAULT_VERSION = { es: 'RV1960', en: 'web' }

export const API_CONFIG = {
  es: { name: 'Español', translation: 'RV1960', credit: 'bolls.life' },
  en: { name: 'English', translation: 'WEB',    credit: 'bible-api.com' }
}

// key: nombre normalizado -> { id, en, es, chapters }
export const BOOK_DATA = {
  // ── Antiguo Testamento ──────────────────────────────
  'genesis':          { id: 1,  en: 'Genesis',         es: 'Génesis',          chapters: 50  },
  'exodo':            { id: 2,  en: 'Exodus',           es: 'Éxodo',            chapters: 40  },
  'levitico':         { id: 3,  en: 'Leviticus',        es: 'Levítico',         chapters: 27  },
  'numeros':          { id: 4,  en: 'Numbers',          es: 'Números',          chapters: 36  },
  'deuteronomio':     { id: 5,  en: 'Deuteronomy',      es: 'Deuteronomio',     chapters: 34  },
  'josue':            { id: 6,  en: 'Joshua',           es: 'Josué',            chapters: 24  },
  'jueces':           { id: 7,  en: 'Judges',           es: 'Jueces',           chapters: 21  },
  'rut':              { id: 8,  en: 'Ruth',             es: 'Rut',              chapters: 4   },
  '1 samuel':         { id: 9,  en: '1 Samuel',         es: '1 Samuel',         chapters: 31  },
  '2 samuel':         { id: 10, en: '2 Samuel',         es: '2 Samuel',         chapters: 24  },
  '1 reyes':          { id: 11, en: '1 Kings',          es: '1 Reyes',          chapters: 22  },
  '2 reyes':          { id: 12, en: '2 Kings',          es: '2 Reyes',          chapters: 25  },
  '1 cronicas':       { id: 13, en: '1 Chronicles',     es: '1 Crónicas',       chapters: 29  },
  '2 cronicas':       { id: 14, en: '2 Chronicles',     es: '2 Crónicas',       chapters: 36  },
  'esdras':           { id: 15, en: 'Ezra',             es: 'Esdras',           chapters: 10  },
  'nehemias':         { id: 16, en: 'Nehemiah',         es: 'Nehemías',         chapters: 13  },
  'ester':            { id: 17, en: 'Esther',           es: 'Ester',            chapters: 10  },
  'job':              { id: 18, en: 'Job',              es: 'Job',              chapters: 42  },
  'salmos':           { id: 19, en: 'Psalms',           es: 'Salmos',           chapters: 150 },
  'proverbios':       { id: 20, en: 'Proverbs',         es: 'Proverbios',       chapters: 31  },
  'eclesiastes':      { id: 21, en: 'Ecclesiastes',     es: 'Eclesiastés',      chapters: 12  },
  'cantares':         { id: 22, en: 'Song of Solomon',  es: 'Cantares',         chapters: 8   },
  'isaias':           { id: 23, en: 'Isaiah',           es: 'Isaías',           chapters: 66  },
  'jeremias':         { id: 24, en: 'Jeremiah',         es: 'Jeremías',         chapters: 52  },
  'lamentaciones':    { id: 25, en: 'Lamentations',     es: 'Lamentaciones',    chapters: 5   },
  'ezequiel':         { id: 26, en: 'Ezekiel',          es: 'Ezequiel',         chapters: 48  },
  'daniel':           { id: 27, en: 'Daniel',           es: 'Daniel',           chapters: 12  },
  'oseas':            { id: 28, en: 'Hosea',            es: 'Oseas',            chapters: 14  },
  'joel':             { id: 29, en: 'Joel',             es: 'Joel',             chapters: 3   },
  'amos':             { id: 30, en: 'Amos',             es: 'Amós',             chapters: 9   },
  'abdias':           { id: 31, en: 'Obadiah',          es: 'Abdías',           chapters: 1   },
  'jonas':            { id: 32, en: 'Jonah',            es: 'Jonás',            chapters: 4   },
  'miqueas':          { id: 33, en: 'Micah',            es: 'Miqueas',          chapters: 7   },
  'nahum':            { id: 34, en: 'Nahum',            es: 'Nahúm',            chapters: 3   },
  'habacuc':          { id: 35, en: 'Habakkuk',         es: 'Habacuc',          chapters: 3   },
  'sofonias':         { id: 36, en: 'Zephaniah',        es: 'Sofonías',         chapters: 3   },
  'hageo':            { id: 37, en: 'Haggai',           es: 'Hageo',            chapters: 2   },
  'zacarias':         { id: 38, en: 'Zechariah',        es: 'Zacarías',         chapters: 14  },
  'malaquias':        { id: 39, en: 'Malachi',          es: 'Malaquías',        chapters: 4   },
  // ── Nuevo Testamento ────────────────────────────────
  'mateo':            { id: 40, en: 'Matthew',          es: 'Mateo',            chapters: 28  },
  'marcos':           { id: 41, en: 'Mark',             es: 'Marcos',           chapters: 16  },
  'lucas':            { id: 42, en: 'Luke',             es: 'Lucas',            chapters: 24  },
  'juan':             { id: 43, en: 'John',             es: 'Juan',             chapters: 21  },
  'hechos':           { id: 44, en: 'Acts',             es: 'Hechos',           chapters: 28  },
  'romanos':          { id: 45, en: 'Romans',           es: 'Romanos',          chapters: 16  },
  '1 corintios':      { id: 46, en: '1 Corinthians',    es: '1 Corintios',      chapters: 16  },
  '2 corintios':      { id: 47, en: '2 Corinthians',    es: '2 Corintios',      chapters: 13  },
  'galatas':          { id: 48, en: 'Galatians',        es: 'Gálatas',          chapters: 6   },
  'efesios':          { id: 49, en: 'Ephesians',        es: 'Efesios',          chapters: 6   },
  'filipenses':       { id: 50, en: 'Philippians',      es: 'Filipenses',       chapters: 4   },
  'colosenses':       { id: 51, en: 'Colossians',       es: 'Colosenses',       chapters: 4   },
  '1 tesalonicenses': { id: 52, en: '1 Thessalonians',  es: '1 Tesalonicenses', chapters: 5   },
  '2 tesalonicenses': { id: 53, en: '2 Thessalonians',  es: '2 Tesalonicenses', chapters: 3   },
  '1 timoteo':        { id: 54, en: '1 Timothy',        es: '1 Timoteo',        chapters: 6   },
  '2 timoteo':        { id: 55, en: '2 Timothy',        es: '2 Timoteo',        chapters: 4   },
  'tito':             { id: 56, en: 'Titus',            es: 'Tito',             chapters: 3   },
  'filemon':          { id: 57, en: 'Philemon',         es: 'Filemón',          chapters: 1   },
  'hebreos':          { id: 58, en: 'Hebrews',          es: 'Hebreos',          chapters: 13  },
  'santiago':         { id: 59, en: 'James',            es: 'Santiago',         chapters: 5   },
  '1 pedro':          { id: 60, en: '1 Peter',          es: '1 Pedro',          chapters: 5   },
  '2 pedro':          { id: 61, en: '2 Peter',          es: '2 Pedro',          chapters: 3   },
  '1 juan':           { id: 62, en: '1 John',           es: '1 Juan',           chapters: 5   },
  '2 juan':           { id: 63, en: '2 John',           es: '2 Juan',           chapters: 1   },
  '3 juan':           { id: 64, en: '3 John',           es: '3 Juan',           chapters: 1   },
  'judas':            { id: 65, en: 'Jude',             es: 'Judas',            chapters: 1   },
  'apocalipsis':      { id: 66, en: 'Revelation',       es: 'Apocalipsis',      chapters: 22  },
}

// Array ordenado de libros para navegación prev/next
export const BOOK_LIST = Object.entries(BOOK_DATA).map(([key, data]) => ({
  key,
  ...data,
  testament: data.id <= 39 ? 'OT' : 'NT'
}))
