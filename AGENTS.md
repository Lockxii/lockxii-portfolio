# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable design decisions

- Do not show an intro or loader animation; open the portfolio directly on its content.
- GitHub activity must use real profile data rather than generated placeholder values.
- The contribution heatmap must use GitHub-scale cells (about 10px), show 52 real weeks across the card, scroll horizontally to the latest weeks on mobile, and show each cell's count in a nearby tooltip on hover or focus.
- Hovering across the contribution heatmap must never restart the reveal animation or make cells disappear or flicker.
- On wide desktop screens, use a subtle static raster background in the side gutters only; keep the centered content column calm and keep tablet/mobile backgrounds plain.
- The wide desktop backdrop animation must be clearly perceptible within a couple of seconds: use visible square color changes and a slow regional wave in the side gutters, while keeping the centered column calm, hiding the effect on tablet/mobile, and respecting reduced-motion.
- In dark mode, the TileWordmark color wave must reuse the exact coral, rose, plum, and amber palette from the animated side background; keep the light-mode wave blue and cobalt.
- Use a crisp pixel-eye favicon on a black rounded tile, with a coral pupil and the portfolio's rose, plum, and amber accents.
- The education section should be a compact editorial timeline below GitHub activity, ordered oldest to newest and ending with ENIGMA School; it must include the user's bac and brevet distinctions.
- The user obtained the brevet with "mention très bien" and the baccalaureate with "mention assez bien". Fully translate these distinctions in English as "Highest honors" and "Honors" respectively; do not retain French labels or parenthetical French text in the English version.
- The ENIGMA School entry should explicitly state that the user is in the second year of the bachelor's degree, in both English and French.
- Keep English as the default and provide a persistent EN/FR toggle in the header that translates all visible copy, controls, accessibility labels, heatmap tooltips, dates, and metadata.
- French copy should read as naturally authored rather than literally translated; keep timeline periods inside their date column, using "Depuis 2026" for the current entry.
- Keep craft-list rows on one line on desktop, using smaller secondary copy when needed; education school names should link to their official site when a URL is available.
- Use dark mode as the first-visit default while preserving an explicit saved light-mode choice.
- Show Codeefy, UNSA · CHU Lille, Prysm, and BrandSearch in Projects, with real screenshots and links. The CHU project is the UNSA Chronos V10 consultation at votechr.vercel.app; Codeefy is at codeefy.lockxi.dev.
- Use a natural, professional tone in French and English. Do not address visitors with the informal French "tu" or use casual greetings. Mention BrandSearch and Prysm, avoid marketing jargon and hosting claims, and close with the GitHub link without repeating a project promotion.
- Keep GitHub activity automatic through the Vercel endpoint with a six-hour cache and no credentials. Contributions, active days, and longest streak must use the same validated 52-week calendar; preserve real GitHub levels and the last valid data if a refresh fails.
- Show only "MOUTON" in uppercase in the bottom TileWordmark. In the contact links, include LinkedIn and omit Designee.
- Use self-hosted Archivo Black for the bottom MOUTON tile wordmark, with upright proportions. Fit its actual glyph width and height without clipping or stretching; preserve its animated tile colors.
- Omit the Craft / Savoir-faire and Now / En ce moment sections at the user's request.
- Show only technology logos after the introduction, with accessible names: JavaScript, TypeScript, Python, PHP, HTML, CSS, SQL, Node.js, React, Next.js, Tailwind CSS, Docker, GitHub, VS Code, PostgreSQL, MySQL, MongoDB, Symfony. Omit Vue, Express, and Git. Fill two complete rows of nine logos on desktop and three rows of six on mobile, spread across the full content width.
- Show the user's supplied certificates directly after GitHub activity and before Education, with readable previews, issue dates, and links to the full images. The Hugging Face certificate covers Unit 1: Foundations of Agents only.
- Do not show a sound button or play click sounds in the portfolio controls.
