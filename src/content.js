export const COPY = {
  en: {
    meta: {
      title: "Lockxii — Fullstack Developer",
      description:
        "Lockxii is a fullstack developer building polished web products, automation, and creative tools.",
    },
    header: {
      role: "Fullstack Developer",
      languageLabel: "Language",
      selectEnglish: "Use English",
      selectFrench: "Use French",
      disableSound: "Disable sound",
      enableSound: "Enable sound",
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
      greeting: "Hi, I'm Lockxii, a",
      role: "fullstack developer",
      focus: "focused on digital products.",
      built: "I recently built",
      designee:
        ", a searchable library of 300+ React components.",
      prysmLead: "I'm also working on",
      prysm:
        ", a creator intelligence workspace spanning web, Chrome, and Shopify.",
      care:
        "I care deeply about useful interfaces and obsess over products that feel fast, polished, and straightforward.",
      more: "Want to see more? Browse my",
      moreJoin: "or see what I'm building on",
    },
    sections: {
      projects: "Projects",
      craft: "Craft",
      activity: "GitHub activity",
      education: "Education",
      elsewhere: "Elsewhere",
    },
    controls: {
      seeLess: "See less",
      seeMore: "See more",
    },
    activity: {
      subtitle: "Real activity from 2026",
      contributions: "Contributions",
      publicCommits: "Public commits",
      privateActivity: "Private activity",
      publicRepos: "Public repos",
    },
    education: {
      entries: "entries",
      current: "Current",
    },
    elsewhere: {
      subtitle: "Where to find me online",
    },
    footer: {
      updated: "Last updated · July 2026",
    },
  },
  fr: {
    meta: {
      title: "Lockxii — Développeur fullstack",
      description:
        "Lockxii est un développeur fullstack qui crée des produits web, des automatisations et des outils créatifs soignés.",
    },
    header: {
      role: "Développeur fullstack",
      languageLabel: "Langue",
      selectEnglish: "Afficher le portfolio en anglais",
      selectFrench: "Afficher le portfolio en français",
      disableSound: "Désactiver le son",
      enableSound: "Activer le son",
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
      greeting: "Bonjour, je suis Lockxii, un",
      role: "développeur fullstack",
      focus: "spécialisé dans les produits numériques.",
      built: "J'ai récemment créé",
      designee:
        ", une bibliothèque consultable de plus de 300 composants React.",
      prysmLead: "Je travaille aussi sur",
      prysm:
        ", un espace de veille dédié aux créateurs pour le web, Chrome et Shopify.",
      care:
        "J'accorde beaucoup d'importance aux interfaces utiles et aux produits rapides, soignés et faciles à comprendre.",
      more: "Envie d'en voir plus ? Parcourez mon",
      moreJoin: "ou découvrez ce que je construis sur",
    },
    sections: {
      projects: "Projets",
      craft: "Savoir-faire",
      activity: "Activité GitHub",
      education: "Formation",
      elsewhere: "Ailleurs",
    },
    controls: {
      seeLess: "Voir moins",
      seeMore: "Voir plus",
    },
    activity: {
      subtitle: "Activité réelle en 2026",
      contributions: "Contributions",
      publicCommits: "Commits publics",
      privateActivity: "Activité privée",
      publicRepos: "Dépôts publics",
    },
    education: {
      entries: "étapes",
      current: "En cours",
    },
    elsewhere: {
      subtitle: "Où me retrouver en ligne",
    },
    footer: {
      updated: "Dernière mise à jour · juillet 2026",
    },
  },
};

export const PROJECTS = [
  {
    name: "Designee",
    description: {
      en: "A searchable library of 300+ copy-ready React components.",
      fr: "Une bibliothèque consultable de plus de 300 composants React prêts à copier.",
    },
    category: { en: "Product", fr: "Produit" },
    year: "2026",
    href: "https://designee.dev",
    image: "/projects/designee.png",
    imagePosition: "center 18%",
  },
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
    name: "Storecrew",
    description: {
      en: "AI agents that turn briefs, URLs, and products into launch-ready Shopify storefronts.",
      fr: "Des agents IA qui transforment briefs, URL et produits en boutiques Shopify prêtes à lancer.",
    },
    category: { en: "Commerce", fr: "Commerce" },
    year: "2026",
    href: "https://www.storecrew.io",
    image: "/projects/storecrew.png",
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
    id: "component-registry",
    name: { en: "Component Registry", fr: "Registre de composants" },
    description: {
      en: "314 copy-ready React interactions and polished states",
      fr: "314 interactions React prêtes à copier et états soignés",
    },
    image: "/projects/designee.png",
    imagePosition: "center 20%",
  },
  {
    id: "market-intelligence",
    name: { en: "Market Intelligence", fr: "Veille de marché" },
    description: {
      en: "7.5M+ stores, 160M+ ads, and competitor tracking",
      fr: "7,5 M+ boutiques, 160 M+ publicités et suivi concurrentiel",
    },
    image: "/projects/brandsearch.png",
    imagePosition: "center top",
  },
  {
    id: "creator-extension",
    name: { en: "Creator Extension", fr: "Extension pour créateurs" },
    description: {
      en: "One-click creator research across the social web",
      fr: "Recherche de créateurs en un clic sur les réseaux sociaux",
    },
    image: "/projects/prysm.webp",
    imagePosition: "center top",
  },
  {
    id: "shopify-agents",
    name: { en: "Shopify Agents", fr: "Agents Shopify" },
    description: {
      en: "From product URL to a branded Shopify storefront",
      fr: "D'une URL de produit à une boutique Shopify de marque",
    },
    image: "/projects/storecrew.png",
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
    award: { en: "Highest honors", fr: "Mention Très bien" },
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
    award: { en: "Honors", fr: "Mention Assez bien" },
  },
  {
    id: "enigma-school",
    period: { en: "2026 — Now", fr: "2026 — Aujourd'hui" },
    school: "ENIGMA School",
    location: "Lille · EuraTechnologies",
    detail: {
      en: "Bachelor's degree in IT Project Coordination",
      fr: "Bachelor Coordinateur de Projets Informatiques",
    },
    href: "https://www.enigma-school.com/",
    current: true,
  },
];

export const SOCIALS = [
  { label: "GitHub", value: "@Lockxii", href: "https://github.com/Lockxii" },
  { label: "Designee", value: "designee.dev", href: "https://designee.dev" },
  { label: "Prysm", value: "tryprysm.com", href: "https://tryprysm.com" },
  { label: "Discord", value: "@lockxi", href: "https://discord.com/lockxi" },
];

export function localized(value, language) {
  return typeof value === "string" ? value : value[language];
}
