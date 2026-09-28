export const COPY = {
  en: {
    meta: {
      title: "Arthur Mouton — Fullstack Developer",
      description:
        "Arthur Mouton is a fullstack developer building polished web products, automation, and creative tools.",
    },
    header: {
      role: "Fullstack Developer",
      languageLabel: "Language",
      selectEnglish: "Use English",
      selectFrench: "Use French",
      switchToDark: "Switch to dark theme",
      switchToLight: "Switch to light theme",
    },
    accessibility: {
      intro: "Introduction",
      viewLabel: (section) => `${section} display`,
      listView: (section) => `${section}: list view`,
      gridView: (section) => `${section}: grid view`,
      projectPreview: (name) => `${name} interface preview`,
      craftPreview: (name) => `${name} preview`,
    },
    intro: {
      greeting: "Hi, I'm Arthur Mouton, a",
      role: "fullstack developer",
      focus: "focused on digital products.",
      recent: "Recently, I built",
      projectsJoin: "and",
      recentDetail:
        " to explore ecommerce markets and track content creators.",
      care:
        "I care deeply about useful interfaces and obsess over products that feel fast, polished, and straightforward.",
      more: "Want to see more? Browse my",
      moreJoin: "or explore",
    },
    sections: {
      projects: "Projects",
      craft: "Craft",
      stack: "Stack",
      activity: "GitHub activity",
      education: "Education",
      now: "Now",
      elsewhere: "Elsewhere",
    },
    controls: {
      seeLess: "See less",
      seeMore: "See more",
    },
    activity: {
      subtitle: "Last 52 weeks · Updated automatically",
      contributions: "Contributions",
      activeDays: "Active days",
      longestStreak: "Longest streak",
      days: "days",
      publicRepos: "Public repos",
    },
    education: {
      entries: "entries",
      current: "Current",
    },
    stack: {
      tools: "tools",
      goals: "goals",
    },
    elsewhere: {
      subtitle: "Where to find me online",
    },
    footer: {
      updated: "Last updated · September 2026",
    },
  },
  fr: {
    meta: {
      title: "Arthur Mouton — Développeur fullstack",
      description:
        "Arthur Mouton est un développeur fullstack qui crée des produits web, des automatisations et des outils créatifs soignés.",
    },
    header: {
      role: "Développeur fullstack",
      languageLabel: "Langue",
      selectEnglish: "Afficher le portfolio en anglais",
      selectFrench: "Afficher le portfolio en français",
      switchToDark: "Passer au thème sombre",
      switchToLight: "Passer au thème clair",
    },
    accessibility: {
      intro: "Présentation",
      viewLabel: (section) => `${section} · Affichage`,
      listView: (section) => `${section} · Vue liste`,
      gridView: (section) => `${section} · Vue grille`,
      projectPreview: (name) => `Aperçu de l'interface de ${name}`,
      craftPreview: (name) => `Aperçu de ${name}`,
    },
    intro: {
      greeting: "Moi, c'est Arthur Mouton. Je suis",
      role: "développeur fullstack",
      focus: "et je conçois des produits numériques.",
      recent: "J'ai récemment créé",
      projectsJoin: "et",
      recentDetail:
        " pour explorer les marchés e-commerce et suivre les créateurs de contenu.",
      care:
        "J'aime concevoir des interfaces utiles et des produits rapides, soignés et simples à utiliser.",
      more: "Pour en voir plus, jetez un œil à mon",
      moreJoin: "ou découvrez",
    },
    sections: {
      projects: "Projets",
      craft: "Savoir-faire",
      stack: "Stack technique",
      activity: "Activité GitHub",
      education: "Formation",
      now: "En ce moment",
      elsewhere: "Ailleurs",
    },
    controls: {
      seeLess: "Voir moins",
      seeMore: "Voir plus",
    },
    activity: {
      subtitle: "52 dernières semaines · Actualisation automatique",
      contributions: "Contributions",
      activeDays: "Jours actifs",
      longestStreak: "Meilleure série",
      days: "jours",
      publicRepos: "Dépôts publics",
    },
    education: {
      entries: "étapes",
      current: "En cours",
    },
    stack: {
      tools: "outils",
      goals: "objectifs",
    },
    elsewhere: {
      subtitle: "Où me retrouver en ligne",
    },
    footer: {
      updated: "Dernière mise à jour · septembre 2026",
    },
  },
};

export const PROJECTS = [
  {
    name: "Prysm",
    description: {
      en: "A creator intelligence workspace with web, Chrome, and Shopify tools.",
      fr: "Un espace de veille dédié aux créateurs pour le web, Chrome et Shopify.",
    },
    category: { en: "SaaS", fr: "SaaS" },
    year: "2026",
    href: "https://tryprysm.com",
    image: "/projects/prysm.webp",
    imagePosition: "center top",
  },
  {
    name: "BrandSearch",
    description: {
      en: "Market research and creative intelligence for winning products, ads, funnels, and competitors.",
      fr: "Étude de marché et veille créative sur les produits, publicités, tunnels et concurrents performants.",
    },
    category: { en: "Market intel", fr: "Veille marché" },
    year: "2026",
    href: "https://brandsearch.co",
    image: "/projects/brandsearch.png",
    imagePosition: "center top",
  },
];

export const CRAFT = [
  {
    id: "frontend-development",
    name: { en: "Frontend Development", fr: "Développement front-end" },
    description: {
      en: "React, TypeScript, JavaScript, and responsive interfaces",
      fr: "React, TypeScript, JavaScript et interfaces adaptatives",
    },
    image: "/projects/designee.png",
    imagePosition: "center 20%",
  },
  {
    id: "product-design",
    name: { en: "Product Design", fr: "Design produit" },
    description: {
      en: "Search flows, data-heavy screens, and clear interactions",
      fr: "Parcours de recherche, écrans de données et interactions claires",
    },
    image: "/projects/brandsearch.png",
    imagePosition: "center top",
  },
  {
    id: "browser-extensions",
    name: { en: "Browser Extensions", fr: "Extensions de navigateur" },
    description: {
      en: "Chrome tools and integrations for creator research",
      fr: "Outils Chrome et intégrations pour la veille créateurs",
    },
    image: "/projects/prysm.webp",
    imagePosition: "center top",
  },
  {
    id: "backend-and-data",
    name: { en: "Backend & Data", fr: "Back-end et données" },
    description: {
      en: "Node.js, APIs, and readable data dashboards",
      fr: "Node.js, API et tableaux de bord lisibles",
    },
    image: "/projects/datyo.png",
    imagePosition: "center top",
  },
];

export const EDUCATION = [
  {
    id: "college-sainte-marie",
    period: { en: "2019 — 2023", fr: "2019 — 2023" },
    school: "Collège Sainte Marie",
    location: "Beaucamps-Ligny",
    detail: {
      en: "French national middle-school diploma",
      fr: "Diplôme national du brevet",
    },
    award: { en: "Highest honors", fr: "Mention très bien" },
  },
  {
    id: "lycee-sainte-marie",
    period: { en: "2023 — 2026", fr: "2023 — 2026" },
    school: "Lycée Sainte Marie",
    location: "Beaucamps-Ligny",
    detail: {
      en: "French general baccalaureate · Mathematics & Computer Science",
      fr: "Baccalauréat général · Mathématiques & NSI",
    },
    award: { en: "Honors", fr: "Mention assez bien" },
    href: "https://stemariebeaucamps.fr/lycee/",
  },
  {
    id: "enigma-school",
    period: { en: "2026 — Now", fr: "Depuis 2026" },
    school: "ENIGMA School",
    location: "Lille · EuraTechnologies",
    detail: {
      en: "Bachelor's degree in IT Project Coordination · Year 2",
      fr: "Bachelor Coordinateur de Projets Informatiques · 2ᵉ année",
    },
    href: "https://www.enigma-school.com/",
    current: true,
  },
];

export const STACK = [
  {
    id: "languages",
    label: { en: "Languages", fr: "Langages" },
    items: ["JavaScript", "TypeScript", "Python", "HTML", "CSS", "SQL"],
  },
  {
    id: "frameworks",
    label: { en: "Frameworks & tools", fr: "Frameworks et outils" },
    items: ["Node.js", "React", "Next.js", "Vue", "Express", "Tailwind CSS", "Docker", "Git", "GitHub", "VS Code"],
  },
  {
    id: "databases",
    label: { en: "Databases", fr: "Bases de données" },
    items: ["PostgreSQL", "MySQL", "MongoDB"],
  },
];

export const NOW = {
  learning: {
    label: { en: "Currently learning", fr: "J'apprends" },
    value: { en: "Backend and DevOps", fr: "Le back-end et le DevOps" },
  },
  goals: [
    { en: "Launch my own SaaS", fr: "Lancer mon propre SaaS" },
    { en: "Ship more public projects", fr: "Publier davantage de projets open source" },
    { en: "Master AI-powered funnels", fr: "Maîtriser les tunnels de vente pilotés par l'IA" },
    { en: "Grow my GitHub portfolio", fr: "Étoffer mon portfolio GitHub" },
  ],
};

export const SOCIALS = [
  { label: "GitHub", value: "@Lockxii", href: "https://github.com/Lockxii" },
  { label: "LinkedIn", value: "Arthur Mouton", href: "https://www.linkedin.com/in/arthur-mouton-783a21404/" },
  { label: "Prysm", value: "tryprysm.com", href: "https://tryprysm.com" },
  { label: "Discord", value: "@lockxi", href: "https://discord.com/lockxi" },
];

export function localized(value, language) {
  return typeof value === "string" ? value : value[language];
}
