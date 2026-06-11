# GeoSphere

GeoSphere is a static browser-based geography game hub built around an interactive canvas-rendered globe. It combines country data, borders, flags, airports, time zones, trivia, and an optional Three.js aircraft overlay across several game modes.

> Screenshot placeholder: add a current desktop screenshot here after the next visual polish pass.

## Run locally

Requirements:

- A current desktop browser.
- Node.js for the local static server.
- An internet connection for the Three.js CDN and optional Wikipedia images. Core country data, geometry, flags, and airport data are local.

Start the development server:

```powershell
node tools/serve-local.mjs 4173
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173).

Opening `index.html` directly may work for much of the app, but the local server is the supported development path.

## Host on a local network

Double-click `run-public.bat`, keep its terminal window open, and use the displayed IPv4 address from another device on the same network. See [HOSTING.md](HOSTING.md) for firewall, port-forwarding, and internet-hosting notes.

## Controls

- Drag: rotate the globe.
- Mouse wheel: zoom.
- `R`: reset the current globe view.
- `N`: next round where supported.
- `Enter`: submit or continue where supported.
- Flight: `A`/`D` or arrow keys steer, `W` boosts, `S` brakes, and `P` pauses Airport Run.
- `Ctrl` + country click: compare countries in Freeroam.
- `Esc`: clear Freeroam selections.

## Game modes

- **Freeroam**: inspect and compare countries, capitals, distances, water bodies, landmarks, map overlays, and experimental flight mode.
- **Globe Hunt**: find a target country on the globe using progressively stronger hints.
- **Distance Duel**: estimate capital-to-capital great-circle distances.
- **Flag Sprint**: identify flags in normal or partially covered hard mode.
- **Trivia Atlas**: answer geography questions about capitals, regions, data, landmarks, food, and other topics.
- **Outline Twist**: identify rotated country outlines.
- **Viewfinder**: identify countries visible in a borderless globe crop.
- **Airport Run**: steer an aircraft toward a target airport.
- **Guess Language**: identify languages from example sentences.
- **Country Traversing**: build a valid route through neighboring countries.
- **Globe Conquest**: play an early turn-based country strategy mode.
- **Continent Puzzle**: drag country shapes into their continent positions.

## Project layout

```text
.
|-- index.html                 Main page and mode navigation
|-- styles.css                 Application styles
|-- asset-paths.js             Canonical runtime and source asset paths
|-- bootstrap.js               Ordered browser asset loader
|-- app-support.js             Safe storage, aliases, and startup diagnostics
|-- app.js                     Current application, modes, and 2D globe renderer
|-- plane-renderer.js          Optional Three.js plane overlay
|-- assets/
|   |-- data/                  Country, GeoJSON, airport, and timezone data
|   |-- Country Flags/         Current ISO-2 flag library
|   |-- Country silhouettes/   Source outline assets; audit before cleanup
|   |-- plane/                 Plane model assets
|   `-- vendor/                Browser-side third-party code
|-- tests/                     Node tests for safety and asset helpers
|-- tools/                     Local server and data/audit scripts
|-- DEVELOPMENT.md             Development workflow and smoke tests
|-- ASSET_PIPELINE.md          Asset rules and cleanup process
`-- HOSTING.md                 Network hosting instructions
```

The long-term refactor will gradually move responsibilities from `app.js` into native ES modules. The migration must remain incremental; do not rewrite the renderer or all modes in one pass.

## Validation

Run the non-destructive foundation checks:

```powershell
node tools/validate-data.mjs
node tools/audit-assets.mjs
```

The data validator exits non-zero for errors. The asset audit reports direct references, known dynamic references, missing assets, and likely-unused candidates without deleting anything.

## Known limitations

- `app.js` is still large and mixes data, UI, gameplay, input, and rendering.
- The 2D globe can be expensive in detailed or animated modes.
- Three.js is loaded from a CDN, so the 3D plane requires internet access unless the dependency is vendored later.
- Wikipedia image enrichment is optional and network-dependent.
- Globe Conquest and Continent Puzzle are early implementations.
- There is not yet an automated browser test suite; use the smoke checklist in [DEVELOPMENT.md](DEVELOPMENT.md).

## Credits and data

- Country boundary data: Natural Earth Admin 0 data, as documented in [assets/data/README.md](assets/data/README.md).
- Flags: the Hampus Borgos `country-flags` collection, sourced primarily from Wikimedia Commons. Preserve its source and licensing notes during cleanup.
- Airport source data: the bundled `airports.dat` follows the OpenFlights airport data format.
- Plane model: [“Medium haul plane (low poly)” by reeledzin](https://sketchfab.com/3d-models/medium-haul-plane-low-poly-226d0f39a9154db9922fcbdd56efe0f5), CC BY 4.0.
- Triangulation: Earcut, stored under `assets/vendor/`.
- Design inspiration: SebLague’s *Geographical Adventures*. No Unity code is copied.

See [DEVELOPMENT.md](DEVELOPMENT.md) before changing data, rendering, or mode lifecycle behavior.
