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
    },
    intro: {
      greeting: "I'm Arthur Mouton, a",
      role: "fullstack developer",
      focus: "building websites and web applications.",
      recent: "Recent projects include",
      projectsJoin: "and",
      recentDetail:
        ", for ecommerce research and keeping up with content creators.",
      care:
        "I develop projects from the initial idea through to launch.",
      more: "Explore my projects below and my contributions on",
    },
    sections: {
      projects: "Projects",
      stack: "Stack",
      activity: "GitHub activity",
      education: "Education",
      certifications: "Certifications",
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
    certifications: {
      view: "View certificate",
    },
    stack: {
      tools: "tools",
    },
    elsewhere: {
      subtitle: "Where to find me online",
    },
    footer: {
      updated: "Last updated · October 2026",
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
    },
    intro: {
      greeting: "Je suis Arthur Mouton,",
      role: "développeur fullstack",
      focus: "et je crée des sites et des applications web.",
      recent: "Parmi mes projets :",
      projectsJoin: "et",
      recentDetail:
        ", pour explorer l'e-commerce et suivre les créateurs de contenu.",
      care:
        "Je développe mes projets de la première idée à leur mise en ligne.",
      more: "Retrouvez mes projets ci-dessous et mes contributions sur",
    },
    sections: {
      projects: "Projets",
      stack: "Stack technique",
      activity: "Activité GitHub",
      education: "Formation",
      certifications: "Certifications",
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
    certifications: {
      view: "Voir l’attestation",
    },
    stack: {
      tools: "outils",
    },
    elsewhere: {
      subtitle: "Où me retrouver en ligne",
    },
    footer: {
      updated: "Dernière mise à jour · octobre 2026",
    },
  },
};

export const PROJECTS = [
  {
    name: "Codeefy",
    description: {
      en: "Coding courses and hands-on exercises in your browser.",
      fr: "Des cours de code et des exercices dans le navigateur.",
    },
    category: { en: "Learning platform", fr: "Plateforme d’apprentissage" },
    year: "2026",
    href: "https://codeefy.lockxi.dev",
    image: "/projects/codeefy.png",
    imagePosition: "center top",
  },
  {
    name: "UNSA · CHU Lille",
    description: {
      en: "A staff consultation website for Lille University Hospital.",
      fr: "Un site de consultation pour les agents du CHU de Lille.",
    },
    category: { en: "Consultation", fr: "Consultation" },
    year: "2026",
    href: "https://votechr.vercel.app",
    image: "/projects/chu-lille.png",
    imagePosition: "center top",
  },
  {
    name: "Prysm",
    description: {
      en: "Track content creators and keep your research in one place.",
      fr: "Un outil pour suivre les créateurs et organiser sa veille.",
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
      en: "Research ecommerce products, ads, and competitors.",
      fr: "Un outil pour analyser les produits et les publicités e-commerce.",
    },
    category: { en: "Market intel", fr: "Veille marché" },
    year: "2026",
    href: "https://brandsearch.co",
    image: "/projects/brandsearch.png",
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

export const CERTIFICATIONS = [
  {
    id: "kaggle-intro-machine-learning",
    title: "Intro to Machine Learning",
    issuer: "Kaggle",
    detail: {
      en: "Introduction to machine learning",
      fr: "Introduction au machine learning",
    },
    date: "2026-10-14",
    image: "/certifications/kaggle-intro-machine-learning.png",
  },
  {
    id: "python-data-science",
    title: "Python 101 for Data Science",
    issuer: "Cognitive Class · IBM",
    detail: {
      en: "Python fundamentals for data science · PY0101EN",
      fr: "Les bases de Python pour la data science · PY0101EN",
    },
    date: "2026-10-10",
    image: "/certifications/python-data-science.png",
  },
  {
    id: "hugging-face-agents",
    title: "Fundamentals of Agents",
    issuer: "Hugging Face",
    detail: {
      en: "Agents Course · Unit 1: Foundations of Agents",
      fr: "Agents Course · Unité 1 : les fondamentaux des agents",
    },
    date: "2026-10-07",
    image: "/certifications/hugging-face-agents.webp",
  },
];

export const STACK = [
  { name: "JavaScript", image: "/stack/javascript.svg" },
  { name: "TypeScript", image: "/stack/typescript.svg" },
  { name: "Python", image: "/stack/python.svg" },
  { name: "PHP", image: "/stack/php.svg" },
  { name: "HTML", image: "/stack/html5.svg" },
  { name: "CSS", image: "/stack/css3.svg" },
  { name: "SQL", image: "/stack/sql.svg", monochrome: true },
  { name: "Node.js", image: "/stack/nodejs.svg" },
  { name: "React", image: "/stack/react.svg" },
  { name: "Next.js", image: "/stack/nextjs.svg", monochrome: true },
  { name: "Tailwind CSS", image: "/stack/tailwindcss.svg" },
  { name: "Docker", image: "/stack/docker.svg" },
  { name: "GitHub", image: "/stack/github.svg", monochrome: true },
  { name: "VS Code", image: "/stack/vscode.svg" },
  { name: "PostgreSQL", image: "/stack/postgresql.svg" },
  { name: "MySQL", image: "/stack/mysql.svg" },
  { name: "MongoDB", image: "/stack/mongodb.svg" },
  { name: "Symfony", image: "/stack/symfony.svg", monochrome: true },
];

export const SOCIALS = [
  { label: "GitHub", value: "@Lockxii", href: "https://github.com/Lockxii" },
  { label: "LinkedIn", value: "Arthur Mouton", href: "https://www.linkedin.com/in/arthur-mouton-783a21404/" },
  { label: "Prysm", value: "tryprysm.com", href: "https://tryprysm.com" },
  { label: "Discord", value: "@lockxi", href: "https://discord.com/lockxi" },
];

export function localized(value, language) {
  return typeof value === "string" ? value : value[language];
}
