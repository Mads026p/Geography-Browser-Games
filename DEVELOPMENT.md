# GeoSphere Development Guide

## Development principles

1. Work in batches of three to five related tasks.
2. Keep unrelated systems untouched.
3. Test and review each batch before beginning another.
4. Do not remove modes or assets to make a refactor easier.
5. Do not delete assets until `tools/audit-assets.mjs` and manual reference checks prove they are unused.
6. Preserve the static-browser workflow and use native browser APIs or ES modules where practical.

## Start the app

```powershell
node tools/serve-local.mjs 4173
```

Open `http://127.0.0.1:4173`.

For local-network testing, use `run-public.bat`. Do not expose the development server publicly without reading [HOSTING.md](HOSTING.md).

## Current architecture

`index.html` defines the persistent shell and mode buttons. `app.js` currently owns most application state, input handling, mode setup, scoring, country matching, geography math, data preparation, and 2D rendering. `plane-renderer.js` owns the optional Three.js plane overlay and must continue returning `false` when the 2D fallback should render.

This is a migration state, not the desired final architecture. Extract pure utilities and static data before extracting modes; extract rendering last.

## Add or change a game mode

Until the mode registry exists:

1. Add or update the mode button in `index.html`.
2. Add the mode ID to the per-mode score state in `app.js`.
3. Decide whether the mode uses the globe in `usesGlobe()`.
4. Add a focused setup function and route it from `newRound()`.
5. Keep mode-specific state grouped under one state property where possible.
6. Ensure leaving the mode clears timers, animation, temporary selections, and flight state.
7. Support keyboard behavior consistently with existing modes.
8. Run the full smoke checklist below.

Do not add another large feature directly to the render loop without first identifying its dirty-state and culling behavior.

## Add country or gameplay data

- Country gameplay source: `assets/data/country-game-data.json`.
- Browser copy: `assets/data/country-game-data.js`.
- Country geometry: `assets/data/custom.geo.json` and its browser wrapper `custom.geo.js`.
- Airports: `assets/data/airports.dat`, generated into `airport-data.js` by `tools/build-airports.mjs`.
- Time zones: `assets/data/timezones.geojson` and its browser wrapper.

When changing a JSON source and browser wrapper, keep both representations synchronized. Run:

```powershell
node tools/validate-data.mjs
```

Required country fields are `name`, `capital`, `lat`, `lon`, `iso2`, `iso3`, and `region`. Coordinates must be finite and within latitude/longitude bounds.

## Add assets

Read [ASSET_PIPELINE.md](ASSET_PIPELINE.md) first.

- Prefer SVG for flags and simple scalable graphics.
- Prefer optimized local images for core gameplay.
- Remote Wikipedia images may enhance a mode but must not be required for it to function.
- Record the source and license for imported assets.
- Run `node tools/audit-assets.mjs` after adding or moving assets.

## Renderer safety

- Never triangulate or simplify country geometry in the normal frame loop.
- Use `requestGlobeRender()` instead of starting an unconditional animation loop.
- Keep back-face and viewport culling intact.
- Avoid repeated DOM queries in hot rendering paths.
- Keep expensive overlays optional.
- Preserve hit detection for small countries when reducing visual detail.
- Verify the globe at the horizon, poles, and antimeridian after geometry changes.
- Keep the 2D plane fallback working when changing the Three.js renderer.

## Foundation checks

```powershell
node --check app.js
node --check plane-renderer.js
node --check tools/serve-local.mjs
node tools/validate-data.mjs
node tools/audit-assets.mjs
```

## Manual smoke test

- [ ] App loads without console errors.
- [ ] Freeroam globe rotates and zooms.
- [ ] Country click opens facts; compare selection can be cleared.
- [ ] Reset view works.
- [ ] Globe Hunt accepts the correct country click.
- [ ] Distance Duel accepts a number and shows the result.
- [ ] Flag Sprint works in normal and hard mode.
- [ ] Trivia Atlas shows a question, image/fallback, and accepts an answer.
- [ ] Outline Twist renders an outline and autocomplete works by keyboard.
- [ ] Viewfinder accepts country guesses and reveals the frame correctly.
- [ ] Airport Run starts flight and its compass updates.
- [ ] Guess Language works and its filters persist for the session.
- [ ] Country Traversing accepts valid neighboring countries.
- [ ] Globe Conquest starts and advances turns.
- [ ] Continent Puzzle drag/drop works.
- [ ] Window resize preserves the layout.
- [ ] A narrow/mobile viewport does not trap content off-screen.

Record any failure with [BUG_REPORT_TEMPLATE.md](BUG_REPORT_TEMPLATE.md).

## Batch completion checklist

After each batch, report:

- Files changed.
- What was fixed or added.
- Commands and manual checks run.
- Remaining issues and risks.
- Confirmation that unrelated systems were not intentionally changed.
