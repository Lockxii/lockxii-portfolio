import { useEffect, useMemo, useState } from "react";
import {
  Grid2X2,
  List,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AmbientTileField } from "./AmbientTileField.jsx";
import { ContributionHeatmap } from "./ContributionHeatmap.jsx";
import { TileWordmark } from "./TileWordmark.jsx";

const PROJECTS = [
  {
    name: "Designee",
    description:
      "A searchable library of 300+ copy-ready React components.",
    category: "Product",
    year: "2026",
    href: "https://designee.dev",
    image: "/projects/designee.png",
    imagePosition: "center 18%",
  },
  {
    name: "Prysm",
    description:
      "A creator intelligence workspace with web, Chrome, and Shopify tools.",
    category: "SaaS",
    year: "2026",
    href: "https://tryprysm.com",
    image: "/projects/prysm.webp",
    imagePosition: "center top",
  },
  {
    name: "Storecrew",
    description:
      "AI agents that turn briefs, URLs, and products into launch-ready Shopify storefronts.",
    category: "Commerce",
    year: "2026",
    href: "https://www.storecrew.io",
    image: "/projects/storecrew.png",
    imagePosition: "center top",
  },
  {
    name: "BrandSearch",
    description:
      "Market research and creative intelligence for winning products, ads, funnels, and competitors.",
    category: "Market intel",
    year: "2026",
    href: "https://brandsearch.co",
    image: "/projects/brandsearch.png",
    imagePosition: "center top",
  },
];

const CRAFT = [
  {
    name: "Component Registry",
    description: "314 copy-ready React interactions and polished states",
    image: "/projects/designee.png",
    imagePosition: "center 20%",
  },
  {
    name: "Market Intelligence",
    description: "7.5M+ stores, 160M+ ads, and competitor tracking",
    image: "/projects/brandsearch.png",
    imagePosition: "center top",
  },
  {
    name: "Creator Extension",
    description: "One-click creator research across the social web",
    image: "/projects/prysm.webp",
    imagePosition: "center top",
  },
  {
    name: "Shopify Agents",
    description: "From product URL to a branded Shopify storefront",
    image: "/projects/storecrew.png",
    imagePosition: "center top",
  },
];

const SOCIALS = [
  { label: "GitHub", value: "@Lockxii", href: "https://github.com/Lockxii" },
  { label: "Designee", value: "designee.dev", href: "https://designee.dev" },
  { label: "Prysm", value: "tryprysm.com", href: "https://tryprysm.com" },
  { label: "Discord", value: "@lockxi", href: "https://discord.com/lockxi" },
];

function IconButton({ label, pressed, onClick, children }) {
  return (
    <button
      className="icon-button"
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ViewToggle({ value, onChange, section }) {
  return (
    <div className="view-toggle" aria-label={`${section} display`}>
      <IconButton
        label={`${section}: list view`}
        pressed={value === "list"}
        onClick={() => onChange("list")}
      >
        <List aria-hidden="true" />
      </IconButton>
      <IconButton
        label={`${section}: grid view`}
        pressed={value === "grid"}
        onClick={() => onChange("grid")}
      >
        <Grid2X2 aria-hidden="true" />
      </IconButton>
    </div>
  );
}

function SectionHeader({ title, view, onViewChange }) {
  return (
    <div className="section-header">
      <h2 id={`${title.toLowerCase()}-heading`}>{title}</h2>
      <ViewToggle value={view} onChange={onViewChange} section={title} />
    </div>
  );
}

function ProjectGrid({ projects }) {
  return (
    <div className="project-grid" id="project-list">
      {projects.map((project) => (
        <a
          className="project-card reveal-item"
          href={project.href}
          target="_blank"
          rel="noreferrer"
          key={project.name}
        >
          <div className="project-media">
            <img
              src={project.image}
              alt={`${project.name} interface preview`}
              style={{ objectPosition: project.imagePosition }}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="project-copy">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

function ProjectList({ projects }) {
  return (
    <ul className="project-list" id="project-list">
      {projects.map((project) => (
        <li className="reveal-item" key={project.name}>
          <a href={project.href} target="_blank" rel="noreferrer">
            <span>{project.name}</span>
            <span className="project-meta">
              {project.category} · {project.year}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function CraftList() {
  return (
    <ul className="craft-list" id="craft-list">
      {CRAFT.map((item) => (
        <li key={item.name}>
          <span>{item.name}</span>
          <span>{item.description}</span>
        </li>
      ))}
    </ul>
  );
}

function CraftGrid() {
  return (
    <div className="craft-grid" id="craft-list">
      {CRAFT.map((item) => (
        <article className="craft-card reveal-item" key={item.name}>
          <div className="craft-media">
            <img
              src={item.image}
              alt={`${item.name} preview`}
              style={{ objectPosition: item.imagePosition }}
              loading="lazy"
              decoding="async"
            />
          </div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem("portfolio-theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      window.localStorage.setItem("portfolio-theme", theme);
    } catch {
      // The theme still works when storage is unavailable.
    }
  }, [theme]);

  return [theme, setTheme];
}

export function App() {
  const [theme, setTheme] = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [projectView, setProjectView] = useState("grid");
  const [craftView, setCraftView] = useState("list");
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = useMemo(
    () => (showAll ? PROJECTS : PROJECTS.slice(0, 2)),
    [showAll],
  );

  function playTick() {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(520, context.currentTime);
      gain.gain.setValueAtTime(0.012, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.045);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.05);
      oscillator.addEventListener("ended", () => context.close(), { once: true });
    } catch {
      // Audio is an enhancement; controls remain functional if it is blocked.
    }
  }

  function updateProjectView(view) {
    setProjectView(view);
    playTick();
  }

  function updateCraftView(view) {
    setCraftView(view);
    playTick();
  }

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
    playTick();
  }

  function toggleSound() {
    if (!soundEnabled) {
      setSoundEnabled(true);
      return;
    }
    playTick();
    setSoundEnabled(false);
  }

  function toggleProjects() {
    setShowAll((current) => !current);
    playTick();
  }

  return (
    <>
      <AmbientTileField theme={theme} />
      <main className="page-shell">
      <header className="site-header reveal-block">
        <div>
          <h1>Lockxii</h1>
          <p>Fullstack Developer</p>
        </div>
        <div className="header-actions">
          <IconButton
            label={soundEnabled ? "Disable sound" : "Enable sound"}
            pressed={soundEnabled}
            onClick={toggleSound}
          >
            {soundEnabled ? (
              <Volume2 aria-hidden="true" />
            ) : (
              <VolumeX aria-hidden="true" />
            )}
          </IconButton>
          <IconButton
            label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            pressed={theme === "dark"}
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <Moon aria-hidden="true" />
            ) : (
              <Sun aria-hidden="true" />
            )}
          </IconButton>
        </div>
      </header>

      <section className="intro reveal-block" aria-label="Introduction">
        <p>
          Hi, I&apos;m Lockxii, a <span className="text-emphasis">fullstack developer</span>{" "}
          focused on digital products.
        </p>
        <p>
          I recently built <a href="https://designee.dev">Designee</a>, a
          searchable library of 300+ React components. I&apos;m also working on{" "}
          <a href="https://tryprysm.com">Prysm</a>, a creator intelligence
          workspace spanning web, Chrome, and Shopify.
        </p>
        <p>
          I care deeply about useful interfaces and obsess over products that
          feel fast, polished, and straightforward.
        </p>
        <p>
          Want to see more? Browse my{" "}
          <a href="https://github.com/Lockxii">GitHub</a> or see what I&apos;m
          building on <a href="https://designee.dev">Designee</a>.
        </p>
      </section>

      <section className="work-section reveal-block" aria-labelledby="projects-heading">
        <div className="section-header">
          <h2 id="projects-heading">Projects</h2>
          <ViewToggle
            value={projectView}
            onChange={updateProjectView}
            section="Projects"
          />
        </div>

        {projectView === "grid" ? (
          <ProjectGrid projects={visibleProjects} />
        ) : (
          <ProjectList projects={visibleProjects} />
        )}

        <button
          className="more-button"
          type="button"
          onClick={toggleProjects}
          aria-expanded={showAll}
          aria-controls="project-list"
        >
          {showAll ? "See less" : "See more"}
        </button>
      </section>

      <section className="craft-section reveal-block" aria-labelledby="craft-heading">
        <SectionHeader
          title="Craft"
          view={craftView}
          onViewChange={updateCraftView}
        />
        {craftView === "list" ? <CraftList /> : <CraftGrid />}
      </section>

      <section className="activity-section reveal-block" aria-labelledby="activity-heading">
        <div className="activity-header">
          <div>
            <h2 id="activity-heading">GitHub activity</h2>
            <p>Real activity from 2026</p>
          </div>
          <a
            href="https://github.com/Lockxii"
            target="_blank"
            rel="noreferrer"
          >
            @Lockxii ↗
          </a>
        </div>

        <dl className="github-stats">
          <div>
            <dt>Contributions</dt>
            <dd>3,059</dd>
          </div>
          <div>
            <dt>Public commits</dt>
            <dd>419</dd>
          </div>
          <div>
            <dt>Private activity</dt>
            <dd>2,634</dd>
          </div>
          <div>
            <dt>Public repos</dt>
            <dd>9</dd>
          </div>
        </dl>

        <ContributionHeatmap />
      </section>

      <div className="wordmark-section reveal-block">
        <TileWordmark word="lockxii" />
      </div>

      <section className="elsewhere reveal-block" aria-labelledby="elsewhere-heading">
        <p className="eyebrow" id="elsewhere-heading">
          Elsewhere
        </p>
        <p>Where to find me online</p>
        <ul>
          {SOCIALS.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer">
                <span>{social.label}</span>
                <span>{social.value}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

        <footer className="site-footer reveal-block">
          <span>Last updated · July 2026</span>
          <span>© 2026 Lockxii</span>
        </footer>
      </main>
    </>
  );
}
