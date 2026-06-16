import {
  Frown,
  Brain,
  ShieldAlert,
  HandHeart,
  Sunrise,
  Cross,
  Dumbbell,
  Heart,
  Feather,
  Compass,
  BatteryLow,
  Flame,
  CloudRain,
  Star,
  Users,
  Fingerprint,
  Target,
  HeartHandshake,
  AlertCircle
} from 'lucide-react'

// Iconos para cada estado de ánimo
export const MOOD_ICONS = {
  triste: Frown,
  ansioso: Brain,
  miedo: ShieldAlert,
  agradecido: HandHeart,
  esperanza: Sunrise,
  fe: Cross,
  fortaleza: Dumbbell,
  amor: Heart,
  paz: Feather,
  perdido: Compass,
  cansado: BatteryLow,
  enojado: Flame,
  duelo: CloudRain,
  autoestima: Star,
  relaciones: Users,
  identidad: Fingerprint,
  proposito: Target,
  perdon: HeartHandshake,
  culpa: AlertCircle
}

// Referencias de versiculos organizadas por estado de animo
// Las referencias están en formato: libro:capitulo:versiculo(s)
export const MOOD_REFERENCES = {
  triste: {
    title: { es: 'Tristeza', en: 'Sadness' },
    keywords: {
      es: ['triste', 'tristeza', 'llorar', 'deprimido', 'depresion', 'solo', 'soledad', 'dolor', 'sufrimiento', 'mal', 'llorando', 'desanimado', 'feo', 'horrible', 'terrible', 'pesimo', 'infeliz', 'abatido', 'decaido', 'melancolico', 'vacio', 'desesperado'],
      en: ['sad', 'sadness', 'cry', 'depressed', 'depression', 'alone', 'lonely', 'pain', 'suffering', 'bad', 'crying', 'discouraged', 'ugly', 'horrible', 'terrible', 'unhappy', 'miserable', 'empty', 'desperate']
    },
    references: [
      'Salmos:34:18', 'Mateo:5:4', 'Salmos:147:3', 'Isaias:41:10', 
      '2 Corintios:1:3-4', 'Apocalipsis:21:4', 'Salmos:30:5', 'Salmos:42:11',
      'Juan:16:33', 'Salmos:23:4', 'Romanos:8:18', 'Salmos:126:5'
    ]
  },
  ansioso: {
    title: { es: 'Ansiedad', en: 'Anxiety' },
    keywords: {
      es: ['ansioso', 'ansiedad', 'preocupado', 'preocupacion', 'nervioso', 'estresado', 'estres', 'angustia', 'angustiado', 'inquieto', 'intranquilo', 'agobiado'],
      en: ['anxious', 'anxiety', 'worried', 'worry', 'nervous', 'stressed', 'stress', 'anguish', 'restless', 'uneasy', 'overwhelmed']
    },
    references: [
      'Filipenses:4:6-7', '1 Pedro:5:7', 'Mateo:6:34', 'Juan:14:27',
      'Isaias:26:3', 'Salmos:94:19', 'Salmos:55:22', 'Proverbios:12:25',
      'Isaias:41:13', 'Salmos:46:10', '2 Tesalonicenses:3:16', 'Mateo:11:28'
    ]
  },
  miedo: {
    title: { es: 'Miedo', en: 'Fear' },
    keywords: {
      es: ['miedo', 'temor', 'asustado', 'temeroso', 'aterrado', 'panico', 'terror', 'espantado'],
      en: ['fear', 'afraid', 'scared', 'terrified', 'panic', 'terror', 'frightened']
    },
    references: [
      'Josue:1:9', '2 Timoteo:1:7', 'Salmos:27:1', 'Isaias:43:1',
      'Salmos:56:3', 'Deuteronomio:31:6', 'Salmos:91:4-5', 'Isaias:54:17',
      'Salmos:118:6', 'Romanos:8:31', 'Salmos:23:4', '1 Juan:4:18'
    ]
  },
  agradecido: {
    title: { es: 'Gratitud', en: 'Gratitude' },
    keywords: {
      es: ['agradecido', 'gratitud', 'gracias', 'bendecido', 'bendicion', 'afortunado', 'contento', 'satisfecho', 'alegre', 'feliz', 'felicidad', 'gozo', 'gozoso', 'dichoso', 'bien', 'genial'],
      en: ['grateful', 'gratitude', 'thankful', 'blessed', 'blessing', 'fortunate', 'content', 'satisfied', 'joyful', 'happy', 'happiness', 'joy', 'good', 'great']
    },
    references: [
      '1 Tesalonicenses:5:18', 'Salmos:107:1', 'Colosenses:3:15', 'Salmos:103:2-3',
      'Filipenses:4:4', 'Santiago:1:17', 'Salmos:100:4', 'Salmos:118:24',
      'Colosenses:3:17', 'Salmos:136:1', 'Efesios:5:20', 'Salmos:9:1'
    ]
  },
  esperanza: {
    title: { es: 'Esperanza', en: 'Hope' },
    keywords: {
      es: ['esperanza', 'esperanzado', 'futuro', 'suenos', 'metas', 'ilusion', 'optimista', 'confiado'],
      en: ['hope', 'hopeful', 'future', 'dreams', 'goals', 'optimistic', 'confident']
    },
    references: [
      'Jeremias:29:11', 'Romanos:15:13', 'Isaias:40:31', 'Lamentaciones:3:22-23',
      'Romanos:8:28', 'Hebreos:11:1', 'Salmos:62:5', 'Romanos:5:3-4',
      'Isaias:43:18-19', '1 Pedro:1:3', 'Salmos:71:14', 'Miqueas:7:7'
    ]
  },
  fe: {
    title: { es: 'Fe', en: 'Faith' },
    keywords: {
      es: ['creer', 'confianza', 'confio', 'oracion', 'orar', 'espiritual'],
      en: ['believe', 'faith', 'trust', 'prayer', 'pray', 'spiritual']
    },
    references: [
      'Hebreos:11:1', 'Proverbios:3:5-6', 'Marcos:11:24', 'Mateo:17:20',
      'Romanos:10:17', 'Santiago:1:6', 'Hebreos:11:6', 'Marcos:9:23',
      '2 Corintios:5:7', 'Galatas:2:20', 'Efesios:2:8', '1 Juan:5:4'
    ]
  },
  fortaleza: {
    title: { es: 'Fortaleza', en: 'Strength' },
    keywords: {
      es: ['fuerte', 'fortaleza', 'fuerza', 'valentia', 'valiente', 'animo', 'poder', 'resistir', 'perseverar', 'luchar', 'victoria'],
      en: ['strong', 'strength', 'power', 'courage', 'brave', 'resist', 'persevere', 'fight', 'victory']
    },
    references: [
      'Filipenses:4:13', 'Isaias:40:29', 'Salmos:46:1', 'Efesios:6:10',
      'Nehemias:8:10', '2 Corintios:12:9', 'Salmos:28:7', 'Isaias:40:31',
      'Salmos:18:32', '1 Cronicas:16:11', 'Habacuc:3:19', 'Salmos:73:26'
    ]
  },
  amor: {
    title: { es: 'Amor', en: 'Love' },
    keywords: {
      es: ['amor', 'amar', 'amado', 'carino', 'querer', 'corazon', 'familia', 'pareja', 'relacion', 'perdon', 'perdonar'],
      en: ['love', 'loved', 'heart', 'family', 'relationship', 'forgiveness', 'forgive']
    },
    references: [
      'Juan:3:16', '1 Corintios:13:4-7', 'Romanos:8:38-39', '1 Juan:4:19',
      '1 Juan:4:8', 'Proverbios:10:12', 'Juan:15:12', '1 Juan:4:7',
      'Colosenses:3:14', '1 Corintios:13:13', 'Efesios:5:25', 'Romanos:13:10'
    ]
  },
  paz: {
    title: { es: 'Paz', en: 'Peace' },
    keywords: {
      es: ['paz', 'tranquilo', 'tranquilidad', 'calma', 'calmado', 'sereno', 'serenidad', 'descanso', 'reposo', 'relajado'],
      en: ['peace', 'calm', 'tranquil', 'serene', 'rest', 'relaxed', 'quiet']
    },
    references: [
      'Juan:14:27', 'Filipenses:4:7', 'Salmos:29:11', 'Isaias:26:3',
      'Mateo:11:28-29', 'Romanos:5:1', 'Salmos:4:8', 'Numeros:6:24-26',
      'Colosenses:3:15', 'Salmos:37:11', '2 Tesalonicenses:3:16', 'Isaias:32:17'
    ]
  },
  perdido: {
    title: { es: 'Dirección', en: 'Direction' },
    keywords: {
      es: ['perdido', 'confundido', 'confusion', 'dudas', 'duda', 'decision', 'camino', 'guia', 'direccion', 'orientacion', 'proposito', 'sentido'],
      en: ['lost', 'confused', 'confusion', 'doubt', 'doubts', 'decision', 'path', 'guide', 'direction', 'purpose', 'meaning']
    },
    references: [
      'Salmos:32:8', 'Proverbios:3:5-6', 'Salmos:119:105', 'Isaias:30:21',
      'Santiago:1:5', 'Jeremias:33:3', 'Salmos:25:4-5', 'Proverbios:16:9',
      'Juan:14:6', 'Salmos:37:5', 'Proverbios:4:11-12', 'Isaias:48:17'
    ]
  },
  cansado: {
    title: { es: 'Cansancio', en: 'Weariness' },
    keywords: {
      es: ['cansado', 'cansancio', 'agotado', 'exhausto', 'fatigado', 'rendido', 'debil', 'sin fuerzas', 'aburrido'],
      en: ['tired', 'weary', 'exhausted', 'fatigued', 'weak', 'no strength', 'bored']
    },
    references: [
      'Mateo:11:28', 'Isaias:40:31', 'Salmos:23:2-3', 'Galatas:6:9',
      'Exodo:33:14', '2 Corintios:4:16', 'Isaias:40:29', 'Salmos:62:1',
      'Jeremias:31:25', 'Salmos:91:1', 'Hebreos:4:9-10', 'Salmos:127:2'
    ]
  },
  enojado: {
    title: { es: 'Enojo', en: 'Anger' },
    keywords: {
      es: ['enojado', 'enojo', 'ira', 'furioso', 'molesto', 'frustrado', 'frustracion', 'rabia', 'irritado', 'enfadado'],
      en: ['angry', 'anger', 'furious', 'upset', 'frustrated', 'frustration', 'rage', 'irritated', 'mad']
    },
    references: [
      'Efesios:4:26-27', 'Proverbios:15:1', 'Santiago:1:19-20', 'Proverbios:14:29',
      'Colosenses:3:8', 'Salmos:37:8', 'Proverbios:16:32', 'Eclesiastes:7:9',
      'Proverbios:19:11', 'Efesios:4:31-32', 'Proverbios:29:11', 'Romanos:12:19'
    ]
  },
  duelo: {
    title: { es: 'Duelo', en: 'Grief' },
    keywords: {
      es: ['duelo', 'luto', 'fallecio', 'murio', 'muerte', 'perdida', 'extraño', 'extrañar', 'ausencia', 'fallecimiento', 'difunto', 'partida'],
      en: ['grief', 'mourning', 'died', 'death', 'loss', 'miss', 'missing', 'absence', 'passed away', 'deceased']
    },
    references: [
      'Salmos:34:18', 'Mateo:5:4', 'Apocalipsis:21:4', 'Juan:11:25-26',
      '2 Corintios:1:3-4', 'Salmos:147:3', 'Isaias:25:8', '1 Tesalonicenses:4:13-14',
      'Salmos:73:26', 'Romanos:8:38-39', 'Salmos:23:4', 'Isaias:41:10'
    ]
  },
  autoestima: {
    title: { es: 'Autoestima', en: 'Self-worth' },
    keywords: {
      es: ['autoestima', 'feo', 'inutil', 'fracasado', 'fracaso', 'no valgo', 'no sirvo', 'inferior', 'rechazado', 'rechazo', 'sin valor', 'verguenza', 'avergonzado', 'inseguro', 'inseguridad'],
      en: ['self-esteem', 'worthless', 'useless', 'failure', 'ugly', 'inferior', 'rejected', 'rejection', 'shame', 'ashamed', 'insecure', 'insecurity']
    },
    references: [
      'Salmos:139:14', 'Efesios:2:10', 'Jeremias:1:5', 'Isaias:43:4',
      '1 Pedro:2:9', 'Salmos:139:13', 'Sofonias:3:17', 'Romanos:8:37',
      'Efesios:1:4-5', 'Galatas:3:26', 'Salmos:8:4-5', 'Isaias:49:16'
    ]
  },
  relaciones: {
    title: { es: 'Relaciones', en: 'Relationships' },
    keywords: {
      es: ['amigos', 'amistad', 'traicion', 'traicionado', 'pareja', 'novio', 'novia', 'familia', 'conflicto', 'pelea', 'distancia', 'abandonado', 'incomprendido', 'ignorado', 'exclusion'],
      en: ['friends', 'friendship', 'betrayal', 'betrayed', 'partner', 'family', 'conflict', 'fight', 'abandoned', 'misunderstood', 'ignored', 'excluded']
    },
    references: [
      'Proverbios:17:17', 'Juan:15:12-13', 'Romanos:12:10', 'Eclesiastes:4:9-10',
      '1 Corintios:13:4-7', 'Colosenses:3:13', 'Hebreos:10:24-25', 'Proverbios:18:24',
      'Galatas:6:2', 'Romanos:15:7', 'Efesios:4:2-3', '1 Pedro:4:8'
    ]
  },
  identidad: {
    title: { es: 'Identidad', en: 'Identity' },
    keywords: {
      es: ['quien soy', 'identidad', 'no se quién soy', 'perdido en', 'propósito de vida', 'existencia', 'para qué', 'por qué estoy', 'sin rumbo', 'vacío existencial', 'quién soy'],
      en: ['who am i', 'identity', 'purpose of life', 'existence', 'why am i here', 'no direction', 'existential void']
    },
    references: [
      'Jeremias:1:5', 'Salmos:139:13-14', 'Efesios:1:4', 'Galatas:2:20',
      '1 Pedro:2:9', 'Romanos:8:16', 'Juan:1:12', '2 Corintios:5:17',
      'Isaias:43:1', 'Colosenses:3:3', 'Efesios:2:10', 'Sofonias:3:17'
    ]
  },
  proposito: {
    title: { es: 'Propósito', en: 'Purpose' },
    keywords: {
      es: ['proposito', 'llamado', 'mision', 'no sé para qué', 'no tengo rumbo', 'sueños', 'vocacion', 'destino', 'significado', 'para que vine', 'que hago con mi vida'],
      en: ['purpose', 'calling', 'mission', 'dreams', 'vocation', 'destiny', 'meaning', 'what am i for']
    },
    references: [
      'Jeremias:29:11', 'Efesios:2:10', 'Romanos:8:28', 'Proverbios:19:21',
      'Salmos:138:8', 'Filipenses:1:6', 'Isaias:46:10', '1 Corintios:12:4-7',
      'Mateo:5:13-14', 'Juan:15:16', 'Romanos:12:6', 'Galatas:1:15'
    ]
  },
  perdon: {
    title: { es: 'Perdón', en: 'Forgiveness' },
    keywords: {
      es: ['perdonar', 'no puedo perdonar', 'rencor', 'resentimiento', 'odio', 'herida', 'herido', 'lastimado', 'me hicieron daño', 'me traicionaron', 'abuso', 'maltrato'],
      en: ['forgive', 'forgiveness', 'resentment', 'grudge', 'hatred', 'hurt', 'wounded', 'betrayed', 'abuse']
    },
    references: [
      'Mateo:6:14-15', 'Efesios:4:31-32', 'Colosenses:3:13', 'Marcos:11:25',
      'Lucas:17:3-4', 'Romanos:12:17-19', 'Proverbios:19:11', 'Mateo:5:44',
      'Isaias:43:25', '1 Juan:1:9', 'Salmos:103:12', 'Hebreos:12:15'
    ]
  },
  culpa: {
    title: { es: 'Culpa', en: 'Guilt' },
    keywords: {
      es: ['culpa', 'culpable', 'me equivoque', 'fallé', 'hice algo mal', 'arrepentido', 'arrepentimiento', 'peca', 'pecado', 'verguenza', 'error grave', 'cometí un error'],
      en: ['guilt', 'guilty', 'made a mistake', 'failed', 'did wrong', 'repentance', 'repentant', 'sin', 'shame', 'serious error']
    },
    references: [
      '1 Juan:1:9', 'Salmos:103:12', 'Romanos:8:1', 'Isaias:1:18',
      'Salmos:32:5', 'Proverbios:28:13', 'Hebreos:10:22', 'Miqueas:7:19',
      'Lucas:15:20', 'Salmos:51:10', '2 Corintios:7:10', 'Isaias:43:25'
    ]
  },
}

// Lista plana de todas las referencias
export const ALL_REFERENCES = Object.values(MOOD_REFERENCES).flatMap(mood => mood.references)
