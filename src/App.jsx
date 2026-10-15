import { useEffect, useState } from "react";
import {
  Grid2X2,
  List,
  Moon,
  Sun,
} from "lucide-react";
import { AmbientTileField } from "./AmbientTileField.jsx";
import { ContributionHeatmap } from "./ContributionHeatmap.jsx";
import { useGitHubActivity } from "./useGitHubActivity.js";
import {
  COPY,
  CERTIFICATIONS,
  EDUCATION,
  PROJECTS,
  SOCIALS,
  STACK,
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

function StackLogos({ copy }) {
  return (
    <section className="stack-section reveal-block" aria-label={copy.sections.stack}>
      <ul className="stack-logos">
        {STACK.map((tool) => (
          <li key={tool.name}>
            <img
              className={tool.monochrome ? "stack-logo is-monochrome" : "stack-logo"}
              src={tool.image}
              alt={tool.name}
              title={tool.name}
              width="28"
              height="28"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Certifications({ language, copy }) {
  const dateFormatter = new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  });

  return (
    <section className="certifications-section reveal-block" aria-labelledby="certifications-heading">
      <div className="education-header">
        <h2 id="certifications-heading">{copy.sections.certifications}</h2>
      </div>
      <div className="certification-grid">
        {CERTIFICATIONS.map((entry) => (
          <a
            className="certification-card"
            href={entry.image}
            target="_blank"
            rel="noreferrer"
            key={entry.id}
          >
            <div className="certification-media">
              <img src={entry.image} alt="" loading="lazy" decoding="async" />
            </div>
            <h3>{entry.title}</h3>
            <p className="certification-issuer">{entry.issuer}</p>
            <p>{localized(entry.detail, language)}</p>
            <time dateTime={entry.date}>
              {dateFormatter.format(new Date(`${entry.date}T00:00:00Z`))}
            </time>
            <span className="certification-link">{copy.certifications.view} ↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem("portfolio-theme") === "light"
        ? "light"
        : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#101010" : "#ffffff");
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
  const githubActivity = useGitHubActivity();
  const [projectView, setProjectView] = useState("grid");
  const copy = COPY[language];
  const numberFormatter = NUMBER_FORMATTERS[language];

  function updateProjectView(view) {
    setProjectView(view);
  }

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  function changeLanguage(nextLanguage) {
    if (nextLanguage === language) return;
    setLanguage(nextLanguage);
  }

  return (
    <>
      <AmbientTileField theme={theme} />
      <main className="page-shell">
      <header className="site-header reveal-block">
        <div>
          <h1>Arthur Mouton</h1>
          <p>{copy.header.role}</p>
        </div>
        <div className="header-actions">
          <LanguageToggle
            language={language}
            labels={copy.header}
            onChange={changeLanguage}
          />
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
          {copy.intro.recent} <a href="https://brandsearch.co">BrandSearch</a>{" "}
          {copy.intro.projectsJoin}{" "}
          <a href="https://tryprysm.com">Prysm</a>
          {copy.intro.recentDetail}
        </p>
        <p>{copy.intro.care}</p>
        <p>
          {copy.intro.more}{" "}
          <a href="https://github.com/Lockxii">GitHub</a>.
        </p>
      </section>

      <StackLogos copy={copy} />

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
            projects={PROJECTS}
            language={language}
            labels={copy.accessibility}
          />
        ) : (
          <ProjectList projects={PROJECTS} language={language} />
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
            <dd>{numberFormatter.format(githubActivity.totalContributions)}</dd>
          </div>
          <div>
            <dt>{copy.activity.activeDays}</dt>
            <dd>{numberFormatter.format(githubActivity.activeDays)}</dd>
          </div>
          <div>
            <dt>{copy.activity.longestStreak}</dt>
            <dd>{numberFormatter.format(githubActivity.longestStreak)} {copy.activity.days}</dd>
          </div>
          <div>
            <dt>{copy.activity.publicRepos}</dt>
            <dd>{numberFormatter.format(githubActivity.publicRepos)}</dd>
          </div>
        </dl>

        <ContributionHeatmap language={language} activity={githubActivity} />
      </section>

      <Certifications language={language} copy={copy} />

      <EducationTimeline language={language} copy={copy} />

      <div className="wordmark-section reveal-block">
        <TileWordmark word="MOUTON" theme={theme} />
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
          <span>© {new Date().getFullYear()} Arthur Mouton</span>
        </footer>
      </main>
    </>
  );
}
