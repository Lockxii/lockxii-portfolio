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
import {
  COPY,
  CRAFT,
  EDUCATION,
  PROJECTS,
  SOCIALS,
  localized,
} from "./content.js";
import { TileWordmark } from "./TileWordmark.jsx";

const NUMBER_FORMATTERS = {
  en: new Intl.NumberFormat("en-US"),
  fr: new Intl.NumberFormat("fr-FR"),
};

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

function LanguageToggle({ language, labels, onChange }) {
  return (
    <div className="language-toggle" role="group" aria-label={labels.languageLabel}>
      <button
        type="button"
        aria-label={labels.selectEnglish}
        aria-pressed={language === "en"}
        onClick={() => onChange("en")}
      >
        EN
      </button>
      <button
        type="button"
        aria-label={labels.selectFrench}
        aria-pressed={language === "fr"}
        onClick={() => onChange("fr")}
      >
        FR
      </button>
    </div>
  );
}

function ViewToggle({ value, onChange, section, labels }) {
  return (
    <div className="view-toggle" aria-label={labels.viewLabel(section)}>
      <IconButton
        label={labels.listView(section)}
        pressed={value === "list"}
        onClick={() => onChange("list")}
      >
        <List aria-hidden="true" />
      </IconButton>
      <IconButton
        label={labels.gridView(section)}
        pressed={value === "grid"}
        onClick={() => onChange("grid")}
      >
        <Grid2X2 aria-hidden="true" />
      </IconButton>
    </div>
  );
}

function SectionHeader({ id, title, view, onViewChange, labels }) {
  return (
    <div className="section-header">
      <h2 id={id}>{title}</h2>
      <ViewToggle
        value={view}
        onChange={onViewChange}
        section={title}
        labels={labels}
      />
    </div>
  );
}

function ProjectGrid({ projects, language, labels }) {
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
              alt={labels.projectPreview(project.name)}
              style={{ objectPosition: project.imagePosition }}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="project-copy">
            <h3>{project.name}</h3>
            <p>{localized(project.description, language)}</p>
          </div>
        </a>
      ))}
    </div>
  );
}

function ProjectList({ projects, language }) {
  return (
    <ul className="project-list" id="project-list">
      {projects.map((project) => (
        <li className="reveal-item" key={project.name}>
          <a href={project.href} target="_blank" rel="noreferrer">
            <span>{project.name}</span>
            <span className="project-meta">
              {localized(project.category, language)} · {project.year}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function CraftList({ language }) {
  return (
    <ul className="craft-list" id="craft-list">
      {CRAFT.map((item) => (
        <li key={item.id}>
          <span>{localized(item.name, language)}</span>
          <span>{localized(item.description, language)}</span>
        </li>
      ))}
    </ul>
  );
}

function CraftGrid({ language, labels }) {
  return (
    <div className="craft-grid" id="craft-list">
      {CRAFT.map((item) => {
        const name = localized(item.name, language);
        return (
          <article className="craft-card reveal-item" key={item.id}>
            <div className="craft-media">
              <img
                src={item.image}
                alt={labels.craftPreview(name)}
                style={{ objectPosition: item.imagePosition }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <h3>{name}</h3>
            <p>{localized(item.description, language)}</p>
          </article>
        );
      })}
    </div>
  );
}

function EducationTimeline({ language, copy }) {
  return (
    <section
      className="education-section reveal-block"
      aria-labelledby="education-heading"
    >
      <div className="education-header">
        <h2 id="education-heading">{copy.sections.education}</h2>
        <span aria-hidden="true">
          {String(EDUCATION.length).padStart(2, "0")} {copy.education.entries}
        </span>
      </div>

      <ol className="education-list">
        {EDUCATION.map((entry) => (
          <li
            className={entry.current ? "education-entry is-current" : "education-entry"}
            key={entry.id}
          >
            <p className="education-period">{localized(entry.period, language)}</p>
            <span className="education-marker" aria-hidden="true" />
            <div className="education-copy">
              <div className="education-title-row">
                <h3>
                  {entry.href ? (
                    <a href={entry.href} target="_blank" rel="noreferrer">
                      {entry.school}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    entry.school
                  )}
                </h3>
                {entry.current ? (
                  <span className="education-current">{copy.education.current}</span>
                ) : null}
              </div>
              <p className="education-location">{entry.location}</p>
              <p className="education-detail">
                <span>{localized(entry.detail, language)}</span>
                {entry.award ? (
                  <span className="education-award">
                    {localized(entry.award, language)}
                  </span>
                ) : null}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
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

function useLanguage() {
  const [language, setLanguage] = useState(() => {
    try {
      return window.localStorage.getItem("portfolio-language") === "fr"
        ? "fr"
        : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    const copy = COPY[language];
    document.documentElement.lang = language;
    document.title = copy.meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", copy.meta.description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", copy.meta.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", copy.meta.description);

    try {
      window.localStorage.setItem("portfolio-language", language);
    } catch {
      // The selected language still works when storage is unavailable.
    }
  }, [language]);

  return [language, setLanguage];
}

export function App() {
  const [theme, setTheme] = useTheme();
  const [language, setLanguage] = useLanguage();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [projectView, setProjectView] = useState("grid");
  const [craftView, setCraftView] = useState("list");
  const [showAll, setShowAll] = useState(false);
  const copy = COPY[language];
  const numberFormatter = NUMBER_FORMATTERS[language];

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

  function changeLanguage(nextLanguage) {
    if (nextLanguage === language) return;
    setLanguage(nextLanguage);
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
          <p>{copy.header.role}</p>
        </div>
        <div className="header-actions">
          <LanguageToggle
            language={language}
            labels={copy.header}
            onChange={changeLanguage}
          />
          <IconButton
            label={soundEnabled ? copy.header.disableSound : copy.header.enableSound}
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
            label={
              theme === "light"
                ? copy.header.switchToDark
                : copy.header.switchToLight
            }
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

      <section className="intro reveal-block" aria-label={copy.accessibility.intro}>
        <p>
          {copy.intro.greeting}{" "}
          <span className="text-emphasis">{copy.intro.role}</span>{" "}
          {copy.intro.focus}
        </p>
        <p>
          {copy.intro.built} <a href="https://designee.dev">Designee</a>
          {copy.intro.designee} {copy.intro.prysmLead}{" "}
          <a href="https://tryprysm.com">Prysm</a>
          {copy.intro.prysm}
        </p>
        <p>{copy.intro.care}</p>
        <p>
          {copy.intro.more}{" "}
          <a href="https://github.com/Lockxii">GitHub</a>{" "}
          {copy.intro.moreJoin}{" "}
          <a href="https://designee.dev">Designee</a>.
        </p>
      </section>

      <section className="work-section reveal-block" aria-labelledby="projects-heading">
        <div className="section-header">
          <h2 id="projects-heading">{copy.sections.projects}</h2>
          <ViewToggle
            value={projectView}
            onChange={updateProjectView}
            section={copy.sections.projects}
            labels={copy.accessibility}
          />
        </div>

        {projectView === "grid" ? (
          <ProjectGrid
            projects={visibleProjects}
            language={language}
            labels={copy.accessibility}
          />
        ) : (
          <ProjectList projects={visibleProjects} language={language} />
        )}

        <button
          className="more-button"
          type="button"
          onClick={toggleProjects}
          aria-expanded={showAll}
          aria-controls="project-list"
        >
          {showAll ? copy.controls.seeLess : copy.controls.seeMore}
        </button>
      </section>

      <section className="craft-section reveal-block" aria-labelledby="craft-heading">
        <SectionHeader
          id="craft-heading"
          title={copy.sections.craft}
          view={craftView}
          onViewChange={updateCraftView}
          labels={copy.accessibility}
        />
        {craftView === "list" ? (
          <CraftList language={language} />
        ) : (
          <CraftGrid language={language} labels={copy.accessibility} />
        )}
      </section>

      <section className="activity-section reveal-block" aria-labelledby="activity-heading">
        <div className="activity-header">
          <div>
            <h2 id="activity-heading">{copy.sections.activity}</h2>
            <p>{copy.activity.subtitle}</p>
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
            <dt>{copy.activity.contributions}</dt>
            <dd>{numberFormatter.format(3059)}</dd>
          </div>
          <div>
            <dt>{copy.activity.publicCommits}</dt>
            <dd>{numberFormatter.format(419)}</dd>
          </div>
          <div>
            <dt>{copy.activity.privateActivity}</dt>
            <dd>{numberFormatter.format(2634)}</dd>
          </div>
          <div>
            <dt>{copy.activity.publicRepos}</dt>
            <dd>{numberFormatter.format(9)}</dd>
          </div>
        </dl>

        <ContributionHeatmap language={language} />
      </section>

      <EducationTimeline language={language} copy={copy} />

      <div className="wordmark-section reveal-block">
        <TileWordmark word="lockxii" theme={theme} />
      </div>

      <section className="elsewhere reveal-block" aria-labelledby="elsewhere-heading">
        <p className="eyebrow" id="elsewhere-heading">
          {copy.sections.elsewhere}
        </p>
        <p>{copy.elsewhere.subtitle}</p>
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
          <span>{copy.footer.updated}</span>
          <span>© 2026 Lockxii</span>
        </footer>
      </main>
    </>
  );
}
