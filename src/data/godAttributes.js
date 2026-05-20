// Atributos de Dios - uno para cada día del mes
// Cada uno con su color, icono único y múltiples referencias bíblicas
export const GOD_ATTRIBUTES = {
  es: [
    {
      id: "fiel",
      name: "Fiel",
      description: "Dios siempre cumple sus promesas. Su fidelidad permanece para siempre.",
      references: [
        "Lamentaciones:3:23", "Deuteronomio:7:9", "Salmos:36:5",
        "1 Corintios:1:9", "2 Tesalonicenses:3:3", "Salmos:89:8",
        "Hebreos:10:23", "Salmos:33:4"
      ],
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      icon: "Shield"
    },
    {
      id: "amoroso",
      name: "Amoroso",
      description: "El amor de Dios es incondicional y eterno. Nos ama sin importar nuestras fallas.",
      references: [
        "1 Juan:4:8", "Juan:3:16", "Romanos:8:38-39",
        "1 Juan:4:19", "Jeremias:31:3", "Salmos:86:15",
        "Efesios:2:4-5", "Romanos:5:8"
      ],
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
      icon: "Heart"
    },
    {
      id: "misericordioso",
      name: "Misericordioso",
      description: "Su misericordia es nueva cada mañana. Perdona y restaura.",
      references: [
        "Lamentaciones:3:22", "Salmos:103:8", "Efesios:2:4",
        "Miqueas:7:18", "Salmos:145:9", "Lucas:6:36",
        "Daniel:9:9", "Hebreos:4:16"
      ],
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      icon: "HandHeart"
    },
    {
      id: "santo",
      name: "Santo",
      description: "Dios es completamente puro y separado del pecado. Su santidad nos transforma.",
      references: [
        "Isaias:6:3", "Apocalipsis:4:8", "1 Pedro:1:16",
        "Levitico:19:2", "Salmos:99:9", "Isaias:57:15",
        "Exodo:15:11", "1 Samuel:2:2"
      ],
      color: "#f8fafc",
      gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      icon: "Sparkles",
      darkText: true
    },
    {
      id: "justo",
      name: "Justo",
      description: "Dios siempre hace lo correcto. Su justicia es perfecta y verdadera.",
      references: [
        "Salmos:145:17", "Deuteronomio:32:4", "Salmos:89:14",
        "Salmos:11:7", "Isaias:45:21", "Sofonias:3:5",
        "Salmos:97:2", "2 Tesalonicenses:1:6"
      ],
      color: "#f97316",
      gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      icon: "Scale"
    },
    {
      id: "todopoderoso",
      name: "Todopoderoso",
      description: "Nada es imposible para Dios. Su poder no tiene límites.",
      references: [
        "Mateo:19:26", "Jeremias:32:17", "Lucas:1:37",
        "Genesis:18:14", "Job:42:2", "Salmos:147:5",
        "Isaias:40:28", "Apocalipsis:19:6"
      ],
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      icon: "Zap"
    },
    {
      id: "omnipresente",
      name: "Omnipresente",
      description: "Dios está en todo lugar. Nunca estamos solos.",
      references: [
        "Salmos:139:7", "Salmos:139:8-10", "Jeremias:23:24",
        "Proverbios:15:3", "Hechos:17:27-28", "Mateo:28:20",
        "Deuteronomio:31:6", "Salmos:46:1"
      ],
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      icon: "Globe"
    },
    {
      id: "proveedor",
      name: "Proveedor",
      description: "Dios suple todas nuestras necesidades según sus riquezas en gloria.",
      references: [
        "Salmos:23:1", "Filipenses:4:19", "Mateo:6:26",
        "Mateo:6:31-33", "Salmos:37:25", "Genesis:22:14",
        "Salmos:111:5", "Santiago:1:17"
      ],
      color: "#22c55e",
      gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      icon: "Gift"
    },
    {
      id: "sanador",
      name: "Sanador",
      description: "Dios restaura nuestro cuerpo, mente y espíritu. Él es nuestro sanador.",
      references: [
        "Exodo:15:26", "Salmos:103:3", "Isaias:53:5",
        "Jeremias:17:14", "Salmos:147:3", "Mateo:4:23",
        "Malaquias:4:2", "3 Juan:1:2"
      ],
      color: "#14b8a6",
      gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
      icon: "HeartPulse"
    },
    {
      id: "consolador",
      name: "Consolador",
      description: "En medio del dolor, Dios nos consuela y nos da paz.",
      references: [
        "Mateo:5:4", "2 Corintios:1:3-4", "Salmos:23:4",
        "Isaias:66:13", "Juan:14:16", "Salmos:34:18",
        "Isaias:49:13", "Salmos:119:76"
      ],
      color: "#a855f7",
      gradient: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
      icon: "CloudSun"
    },
    {
      id: "paciente",
      name: "Paciente",
      description: "Dios es lento para la ira y grande en misericordia. Espera por nosotros.",
      references: [
        "2 Pedro:3:9", "Romanos:2:4", "Exodo:34:6",
        "Salmos:86:15", "Numeros:14:18", "Nahum:1:3",
        "1 Timoteo:1:16", "Romanos:9:22"
      ],
      color: "#64748b",
      gradient: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
      icon: "Clock"
    },
    {
      id: "perdonador",
      name: "Perdonador",
      description: "No hay pecado tan grande que Dios no pueda perdonar cuando nos arrepentimos.",
      references: [
        "1 Juan:1:9", "Salmos:103:12", "Isaias:1:18",
        "Miqueas:7:18-19", "Efesios:1:7", "Colosenses:1:13-14",
        "Hechos:3:19", "Salmos:86:5"
      ],
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      icon: "Eraser"
    },
    {
      id: "protector",
      name: "Protector",
      description: "Dios es nuestro refugio y fortaleza. Nos guarda de todo mal.",
      references: [
        "Salmos:18:2", "Salmos:91:1-2", "Salmos:121:7-8",
        "Proverbios:18:10", "Salmos:46:1", "Nahum:1:7",
        "2 Tesalonicenses:3:3", "Salmos:32:7"
      ],
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      icon: "ShieldCheck"
    },
    {
      id: "sabio",
      name: "Sabio",
      description: "La sabiduría de Dios es infinita. Él conoce todas las cosas.",
      references: [
        "Romanos:11:33", "Job:12:13", "Proverbios:2:6",
        "Isaias:55:8-9", "Daniel:2:20", "1 Corintios:1:25",
        "Colosenses:2:3", "Santiago:1:5"
      ],
      color: "#eab308",
      gradient: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
      icon: "Lightbulb"
    },
    {
      id: "creador",
      name: "Creador",
      description: "Dios creó todo lo que existe. Somos obra de sus manos.",
      references: [
        "Genesis:1:1", "Salmos:33:6", "Colosenses:1:16",
        "Isaias:40:28", "Juan:1:3", "Hebreos:11:3",
        "Salmos:104:24", "Apocalipsis:4:11"
      ],
      color: "#84cc16",
      gradient: "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",
      icon: "Palette"
    },
    {
      id: "eterno",
      name: "Eterno",
      description: "Dios no tiene principio ni fin. Él es el mismo ayer, hoy y siempre.",
      references: [
        "Salmos:90:2", "Isaias:40:28", "Apocalipsis:1:8",
        "Deuteronomio:33:27", "1 Timoteo:1:17", "Salmos:102:27",
        "Hebreos:13:8", "Isaias:57:15"
      ],
      color: "#7c3aed",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
      icon: "Infinity"
    },
    {
      id: "bueno",
      name: "Bueno",
      description: "Todo lo que Dios hace es bueno. Su bondad nos persigue todos los días.",
      references: [
        "Salmos:145:9", "Salmos:34:8", "Nahum:1:7",
        "Salmos:100:5", "Salmos:107:1", "Marcos:10:18",
        "Salmos:119:68", "Santiago:1:17"
      ],
      color: "#f472b6",
      gradient: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
      icon: "ThumbsUp"
    },
    {
      id: "cercano",
      name: "Cercano",
      description: "Dios no está lejos. Él está cerca de los quebrantados de corazón.",
      references: [
        "Salmos:34:18", "Salmos:145:18", "Hechos:17:27",
        "Deuteronomio:4:7", "Santiago:4:8", "Jeremias:23:23",
        "Salmos:73:28", "Filipenses:4:5"
      ],
      color: "#f43f5e",
      gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
      icon: "Users"
    },
    {
      id: "libertador",
      name: "Libertador",
      description: "Dios rompe las cadenas y nos da verdadera libertad.",
      references: [
        "Juan:8:36", "Galatas:5:1", "Salmos:34:17",
        "2 Samuel:22:2", "Salmos:18:2", "Isaias:61:1",
        "Lucas:4:18", "Romanos:8:2"
      ],
      color: "#0ea5e9",
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
      icon: "KeyRound"
    },
    {
      id: "luz",
      name: "Luz",
      description: "Dios ilumina nuestro camino y disipa toda oscuridad.",
      references: [
        "1 Juan:1:5", "Juan:8:12", "Salmos:27:1",
        "Juan:1:5", "Isaias:60:19", "Salmos:119:105",
        "2 Corintios:4:6", "Salmos:18:28"
      ],
      color: "#fbbf24",
      gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
      icon: "Sun"
    },
    {
      id: "pastor",
      name: "Pastor",
      description: "Dios nos guía, nos cuida y nos lleva por sendas de justicia.",
      references: [
        "Juan:10:11", "Salmos:23:1-3", "Ezequiel:34:12",
        "Isaias:40:11", "Juan:10:14", "Hebreos:13:20",
        "1 Pedro:2:25", "Juan:10:27-28"
      ],
      color: "#16a34a",
      gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
      icon: "Wheat"
    },
    {
      id: "padre",
      name: "Padre",
      description: "Dios nos adopta como hijos y nos ama con amor de padre.",
      references: [
        "1 Juan:3:1", "Romanos:8:15", "2 Corintios:6:18",
        "Galatas:4:6", "Mateo:6:9", "Salmos:68:5",
        "Efesios:1:5", "Romanos:8:14"
      ],
      color: "#2563eb",
      gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      icon: "Home"
    },
    {
      id: "refugio",
      name: "Refugio",
      description: "En Dios encontramos seguridad en medio de las tormentas.",
      references: [
        "Salmos:46:1", "Salmos:91:2", "Proverbios:18:10",
        "Deuteronomio:33:27", "Salmos:62:7-8", "2 Samuel:22:3",
        "Salmos:9:9", "Nahum:1:7"
      ],
      color: "#78716c",
      gradient: "linear-gradient(135deg, #78716c 0%, #57534e 100%)",
      icon: "Mountain"
    },
    {
      id: "verdadero",
      name: "Verdadero",
      description: "Dios no miente. Su palabra es verdad absoluta.",
      references: [
        "Juan:17:17", "Juan:14:6", "Numeros:23:19",
        "Tito:1:2", "Hebreos:6:18", "Juan:1:14",
        "Salmos:33:4", "Salmos:119:160"
      ],
      color: "#0d9488",
      gradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
      icon: "BookOpen"
    },
    {
      id: "generoso",
      name: "Generoso",
      description: "Dios da abundantemente y sin reproche a quien le pide.",
      references: [
        "Santiago:1:17", "2 Corintios:9:8", "Efesios:3:20",
        "Romanos:8:32", "Salmos:84:11", "Juan:10:10",
        "Filipenses:4:19", "Mateo:7:11"
      ],
      color: "#d946ef",
      gradient: "linear-gradient(135deg, #d946ef 0%, #c026d3 100%)",
      icon: "Gem"
    },
    {
      id: "inmutable",
      name: "Inmutable",
      description: "Dios no cambia. Podemos confiar en Él siempre.",
      references: [
        "Hebreos:13:8", "Malaquias:3:6", "Santiago:1:17",
        "Numeros:23:19", "Salmos:102:27", "Isaias:40:8",
        "Hebreos:6:17-18", "1 Samuel:15:29"
      ],
      color: "#6b7280",
      gradient: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
      icon: "Anchor"
    },
    {
      id: "soberano",
      name: "Soberano",
      description: "Dios tiene el control de todo. Nada escapa de sus manos.",
      references: [
        "Salmos:103:19", "Daniel:4:35", "Salmos:115:3",
        "Isaias:46:10", "1 Cronicas:29:11-12", "Proverbios:19:21",
        "Efesios:1:11", "Apocalipsis:19:6"
      ],
      color: "#be185d",
      gradient: "linear-gradient(135deg, #be185d 0%, #9d174d 100%)",
      icon: "Crown"
    },
    {
      id: "glorioso",
      name: "Glorioso",
      description: "La gloria de Dios llena toda la tierra. Su majestad es incomparable.",
      references: [
        "Salmos:19:1", "Isaias:6:3", "Exodo:33:18-19",
        "Salmos:8:1", "Habacuc:2:14", "Salmos:97:6",
        "2 Corintios:3:18", "Juan:1:14"
      ],
      color: "#fcd34d",
      gradient: "linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)",
      icon: "Star"
    },
    {
      id: "redentor",
      name: "Redentor",
      description: "Dios nos rescató del pecado a través de Jesucristo.",
      references: [
        "Efesios:1:7", "Colosenses:1:14", "1 Pedro:1:18-19",
        "Romanos:3:24", "Galatas:3:13", "Tito:2:14",
        "Isaias:44:22", "Salmos:130:7-8"
      ],
      color: "#dc2626",
      gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
      icon: "Cross"
    },
    {
      id: "esperanza",
      name: "Esperanza",
      description: "Dios es nuestra esperanza viva. En Él encontramos un futuro seguro.",
      references: [
        "Romanos:15:13", "Jeremias:29:11", "Hebreos:6:19",
        "1 Pedro:1:3", "Salmos:39:7", "Romanos:8:24-25",
        "Salmos:62:5", "Isaias:40:31"
      ],
      color: "#38bdf8",
      gradient: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
      icon: "Sunrise"
    },
    {
      id: "restaurador",
      name: "Restaurador",
      description: "Dios restaura lo que estaba perdido y renueva todas las cosas.",
      references: [
        "Apocalipsis:21:5", "Joel:2:25", "Salmos:51:12",
        "Salmos:23:3", "Isaias:61:7", "Jeremias:30:17",
        "1 Pedro:5:10", "Salmos:71:20"
      ],
      color: "#4ade80",
      gradient: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
      icon: "RefreshCw"
    }
  ],
  en: [
    {
      id: "faithful",
      name: "Faithful",
      description: "God always keeps His promises. His faithfulness endures forever.",
      references: [
        "Lamentaciones:3:23", "Deuteronomio:7:9", "Salmos:36:5",
        "1 Corintios:1:9", "2 Tesalonicenses:3:3", "Salmos:89:8",
        "Hebreos:10:23", "Salmos:33:4"
      ],
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      icon: "Shield"
    },
    {
      id: "loving",
      name: "Loving",
      description: "God's love is unconditional and eternal. He loves us despite our failures.",
      references: [
        "1 Juan:4:8", "Juan:3:16", "Romanos:8:38-39",
        "1 Juan:4:19", "Jeremias:31:3", "Salmos:86:15",
        "Efesios:2:4-5", "Romanos:5:8"
      ],
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
      icon: "Heart"
    },
    {
      id: "merciful",
      name: "Merciful",
      description: "His mercy is new every morning. He forgives and restores.",
      references: [
        "Lamentaciones:3:22", "Salmos:103:8", "Efesios:2:4",
        "Miqueas:7:18", "Salmos:145:9", "Lucas:6:36",
        "Daniel:9:9", "Hebreos:4:16"
      ],
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      icon: "HandHeart"
    },
    {
      id: "holy",
      name: "Holy",
      description: "God is completely pure and separate from sin. His holiness transforms us.",
      references: [
        "Isaias:6:3", "Apocalipsis:4:8", "1 Pedro:1:16",
        "Levitico:19:2", "Salmos:99:9", "Isaias:57:15",
        "Exodo:15:11", "1 Samuel:2:2"
      ],
      color: "#f8fafc",
      gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      icon: "Sparkles",
      darkText: true
    },
    {
      id: "just",
      name: "Just",
      description: "God always does what is right. His justice is perfect and true.",
      references: [
        "Salmos:145:17", "Deuteronomio:32:4", "Salmos:89:14",
        "Salmos:11:7", "Isaias:45:21", "Sofonias:3:5",
        "Salmos:97:2", "2 Tesalonicenses:1:6"
      ],
      color: "#f97316",
      gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      icon: "Scale"
    },
    {
      id: "almighty",
      name: "Almighty",
      description: "Nothing is impossible for God. His power has no limits.",
      references: [
        "Mateo:19:26", "Jeremias:32:17", "Lucas:1:37",
        "Genesis:18:14", "Job:42:2", "Salmos:147:5",
        "Isaias:40:28", "Apocalipsis:19:6"
      ],
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      icon: "Zap"
    },
    {
      id: "omnipresent",
      name: "Omnipresent",
      description: "God is everywhere. We are never alone.",
      references: [
        "Salmos:139:7", "Salmos:139:8-10", "Jeremias:23:24",
        "Proverbios:15:3", "Hechos:17:27-28", "Mateo:28:20",
        "Deuteronomio:31:6", "Salmos:46:1"
      ],
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      icon: "Globe"
    },
    {
      id: "provider",
      name: "Provider",
      description: "God supplies all our needs according to His riches in glory.",
      references: [
        "Salmos:23:1", "Filipenses:4:19", "Mateo:6:26",
        "Mateo:6:31-33", "Salmos:37:25", "Genesis:22:14",
        "Salmos:111:5", "Santiago:1:17"
      ],
      color: "#22c55e",
      gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      icon: "Gift"
    },
    {
      id: "healer",
      name: "Healer",
      description: "God restores our body, mind, and spirit. He is our healer.",
      references: [
        "Exodo:15:26", "Salmos:103:3", "Isaias:53:5",
        "Jeremias:17:14", "Salmos:147:3", "Mateo:4:23",
        "Malaquias:4:2", "3 Juan:1:2"
      ],
      color: "#14b8a6",
      gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
      icon: "HeartPulse"
    },
    {
      id: "comforter",
      name: "Comforter",
      description: "In the midst of pain, God comforts us and gives us peace.",
      references: [
        "Mateo:5:4", "2 Corintios:1:3-4", "Salmos:23:4",
        "Isaias:66:13", "Juan:14:16", "Salmos:34:18",
        "Isaias:49:13", "Salmos:119:76"
      ],
      color: "#a855f7",
      gradient: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
      icon: "CloudSun"
    },
    {
      id: "patient",
      name: "Patient",
      description: "God is slow to anger and rich in mercy. He waits for us.",
      references: [
        "2 Pedro:3:9", "Romanos:2:4", "Exodo:34:6",
        "Salmos:86:15", "Numeros:14:18", "Nahum:1:3",
        "1 Timoteo:1:16", "Romanos:9:22"
      ],
      color: "#64748b",
      gradient: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
      icon: "Clock"
    },
    {
      id: "forgiving",
      name: "Forgiving",
      description: "No sin is too great for God to forgive when we repent.",
      references: [
        "1 Juan:1:9", "Salmos:103:12", "Isaias:1:18",
        "Miqueas:7:18-19", "Efesios:1:7", "Colosenses:1:13-14",
        "Hechos:3:19", "Salmos:86:5"
      ],
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      icon: "Eraser"
    },
    {
      id: "protector",
      name: "Protector",
      description: "God is our refuge and fortress. He guards us from all harm.",
      references: [
        "Salmos:18:2", "Salmos:91:1-2", "Salmos:121:7-8",
        "Proverbios:18:10", "Salmos:46:1", "Nahum:1:7",
        "2 Tesalonicenses:3:3", "Salmos:32:7"
      ],
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      icon: "ShieldCheck"
    },
    {
      id: "wise",
      name: "Wise",
      description: "God's wisdom is infinite. He knows all things.",
      references: [
        "Romanos:11:33", "Job:12:13", "Proverbios:2:6",
        "Isaias:55:8-9", "Daniel:2:20", "1 Corintios:1:25",
        "Colosenses:2:3", "Santiago:1:5"
      ],
      color: "#eab308",
      gradient: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
      icon: "Lightbulb"
    },
    {
      id: "creator",
      name: "Creator",
      description: "God created everything that exists. We are the work of His hands.",
      references: [
        "Genesis:1:1", "Salmos:33:6", "Colosenses:1:16",
        "Isaias:40:28", "Juan:1:3", "Hebreos:11:3",
        "Salmos:104:24", "Apocalipsis:4:11"
      ],
      color: "#84cc16",
      gradient: "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",
      icon: "Palette"
    },
    {
      id: "eternal",
      name: "Eternal",
      description: "God has no beginning or end. He is the same yesterday, today, and forever.",
      references: [
        "Salmos:90:2", "Isaias:40:28", "Apocalipsis:1:8",
        "Deuteronomio:33:27", "1 Timoteo:1:17", "Salmos:102:27",
        "Hebreos:13:8", "Isaias:57:15"
      ],
      color: "#7c3aed",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
      icon: "Infinity"
    },
    {
      id: "good",
      name: "Good",
      description: "Everything God does is good. His goodness follows us all our days.",
      references: [
        "Salmos:145:9", "Salmos:34:8", "Nahum:1:7",
        "Salmos:100:5", "Salmos:107:1", "Marcos:10:18",
        "Salmos:119:68", "Santiago:1:17"
      ],
      color: "#f472b6",
      gradient: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
      icon: "ThumbsUp"
    },
    {
      id: "near",
      name: "Near",
      description: "God is not far away. He is close to the brokenhearted.",
      references: [
        "Salmos:34:18", "Salmos:145:18", "Hechos:17:27",
        "Deuteronomio:4:7", "Santiago:4:8", "Jeremias:23:23",
        "Salmos:73:28", "Filipenses:4:5"
      ],
      color: "#f43f5e",
      gradient: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
      icon: "Users"
    },
    {
      id: "deliverer",
      name: "Deliverer",
      description: "God breaks chains and gives us true freedom.",
      references: [
        "Juan:8:36", "Galatas:5:1", "Salmos:34:17",
        "2 Samuel:22:2", "Salmos:18:2", "Isaias:61:1",
        "Lucas:4:18", "Romanos:8:2"
      ],
      color: "#0ea5e9",
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
      icon: "KeyRound"
    },
    {
      id: "light",
      name: "Light",
      description: "God illuminates our path and dispels all darkness.",
      references: [
        "1 Juan:1:5", "Juan:8:12", "Salmos:27:1",
        "Juan:1:5", "Isaias:60:19", "Salmos:119:105",
        "2 Corintios:4:6", "Salmos:18:28"
      ],
      color: "#fbbf24",
      gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
      icon: "Sun"
    },
    {
      id: "shepherd",
      name: "Shepherd",
      description: "God guides us, cares for us, and leads us in paths of righteousness.",
      references: [
        "Juan:10:11", "Salmos:23:1-3", "Ezequiel:34:12",
        "Isaias:40:11", "Juan:10:14", "Hebreos:13:20",
        "1 Pedro:2:25", "Juan:10:27-28"
      ],
      color: "#16a34a",
      gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
      icon: "Wheat"
    },
    {
      id: "father",
      name: "Father",
      description: "God adopts us as children and loves us with a father's love.",
      references: [
        "1 Juan:3:1", "Romanos:8:15", "2 Corintios:6:18",
        "Galatas:4:6", "Mateo:6:9", "Salmos:68:5",
        "Efesios:1:5", "Romanos:8:14"
      ],
      color: "#2563eb",
      gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      icon: "Home"
    },
    {
      id: "refuge",
      name: "Refuge",
      description: "In God we find safety in the midst of storms.",
      references: [
        "Salmos:46:1", "Salmos:91:2", "Proverbios:18:10",
        "Deuteronomio:33:27", "Salmos:62:7-8", "2 Samuel:22:3",
        "Salmos:9:9", "Nahum:1:7"
      ],
      color: "#78716c",
      gradient: "linear-gradient(135deg, #78716c 0%, #57534e 100%)",
      icon: "Mountain"
    },
    {
      id: "true",
      name: "True",
      description: "God does not lie. His word is absolute truth.",
      references: [
        "Juan:17:17", "Juan:14:6", "Numeros:23:19",
        "Tito:1:2", "Hebreos:6:18", "Juan:1:14",
        "Salmos:33:4", "Salmos:119:160"
      ],
      color: "#0d9488",
      gradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
      icon: "BookOpen"
    },
    {
      id: "generous",
      name: "Generous",
      description: "God gives abundantly and without reproach to those who ask.",
      references: [
        "Santiago:1:17", "2 Corintios:9:8", "Efesios:3:20",
        "Romanos:8:32", "Salmos:84:11", "Juan:10:10",
        "Filipenses:4:19", "Mateo:7:11"
      ],
      color: "#d946ef",
      gradient: "linear-gradient(135deg, #d946ef 0%, #c026d3 100%)",
      icon: "Gem"
    },
    {
      id: "unchanging",
      name: "Unchanging",
      description: "God does not change. We can always trust Him.",
      references: [
        "Hebreos:13:8", "Malaquias:3:6", "Santiago:1:17",
        "Numeros:23:19", "Salmos:102:27", "Isaias:40:8",
        "Hebreos:6:17-18", "1 Samuel:15:29"
      ],
      color: "#6b7280",
      gradient: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
      icon: "Anchor"
    },
    {
      id: "sovereign",
      name: "Sovereign",
      description: "God is in control of everything. Nothing escapes His hands.",
      references: [
        "Salmos:103:19", "Daniel:4:35", "Salmos:115:3",
        "Isaias:46:10", "1 Cronicas:29:11-12", "Proverbios:19:21",
        "Efesios:1:11", "Apocalipsis:19:6"
      ],
      color: "#be185d",
      gradient: "linear-gradient(135deg, #be185d 0%, #9d174d 100%)",
      icon: "Crown"
    },
    {
      id: "glorious",
      name: "Glorious",
      description: "God's glory fills the whole earth. His majesty is incomparable.",
      references: [
        "Salmos:19:1", "Isaias:6:3", "Exodo:33:18-19",
        "Salmos:8:1", "Habacuc:2:14", "Salmos:97:6",
        "2 Corintios:3:18", "Juan:1:14"
      ],
      color: "#fcd34d",
      gradient: "linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)",
      icon: "Star"
    },
    {
      id: "redeemer",
      name: "Redeemer",
      description: "God rescued us from sin through Jesus Christ.",
      references: [
        "Efesios:1:7", "Colosenses:1:14", "1 Pedro:1:18-19",
        "Romanos:3:24", "Galatas:3:13", "Tito:2:14",
        "Isaias:44:22", "Salmos:130:7-8"
      ],
      color: "#dc2626",
      gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
      icon: "Cross"
    },
    {
      id: "hope",
      name: "Hope",
      description: "God is our living hope. In Him we find a secure future.",
      references: [
        "Romanos:15:13", "Jeremias:29:11", "Hebreos:6:19",
        "1 Pedro:1:3", "Salmos:39:7", "Romanos:8:24-25",
        "Salmos:62:5", "Isaias:40:31"
      ],
      color: "#38bdf8",
      gradient: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
      icon: "Sunrise"
    },
    {
      id: "restorer",
      name: "Restorer",
      description: "God restores what was lost and makes all things new.",
      references: [
        "Apocalipsis:21:5", "Joel:2:25", "Salmos:51:12",
        "Salmos:23:3", "Isaias:61:7", "Jeremias:30:17",
        "1 Pedro:5:10", "Salmos:71:20"
      ],
      color: "#4ade80",
      gradient: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
      icon: "RefreshCw"
    }
  ]
}

// Obtener el atributo del día basado en la fecha
export function getDailyAttribute(lang = 'es') {
  const today = new Date()
  const dayOfMonth = today.getDate() - 1 // 0-30
  const attributes = GOD_ATTRIBUTES[lang] || GOD_ATTRIBUTES['es']
  return attributes[dayOfMonth % attributes.length]
}

// Obtener todos los atributos
export function getAllAttributes(lang = 'es') {
  return GOD_ATTRIBUTES[lang] || GOD_ATTRIBUTES['es']
}
