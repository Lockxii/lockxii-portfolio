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
