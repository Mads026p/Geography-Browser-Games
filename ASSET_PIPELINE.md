# GeoSphere Asset Pipeline

## Safety rule

Do not delete, rename, move, or regenerate an asset until all of these have been checked:

1. Direct references in HTML, CSS, JavaScript, Markdown, tools, and batch files.
2. Dynamic paths generated from ISO codes, slugs, country names, or mode data.
3. Browser fallback behavior.
4. `node tools/audit-assets.mjs`.
5. A manual smoke test of every affected mode.

The audit script reports candidates only. It never deletes files.

## Canonical paths

Runtime and source asset locations are defined in `asset-paths.js`.

Browser bootstrap, flag lookup, plane loading, validation, airport generation, and asset auditing use this manifest. Add or move a runtime asset by updating the manifest first, then run the full validation and audit commands.

## Flags

Current location:

```text
assets/Country Flags/svg/<lowercase ISO-3166-1 alpha-2>.svg
```

Examples:

```text
assets/Country Flags/svg/dk.svg
assets/Country Flags/svg/de.svg
assets/Country Flags/svg/xk.svg
```

`app.js` generates these paths dynamically in `localIsoFlagPath()`. A future cleanup may rename this folder to `assets/flags`, but that must be a separate batch which updates the central helper and verifies every game country.

The current folder is a copied upstream flag repository and contains vendor metadata and scripts. Do not remove those files until the asset-cleanup batch has reviewed the audit report and preserved source/license information.

## Country silhouettes

Source silhouettes are stored under:

```text
assets/Country silhouettes/all/<ISO2>/
```

Each directory may contain several PNG sizes and `vector.svg`. The current runtime primarily generates Outline Twist and Continent Puzzle geometry from GeoJSON, so these files may be cleanup candidates. They must remain until direct and dynamic usage has been audited and the affected modes have been manually tested.

## Country and map data

Runtime browser data is loaded by `index.html`:

- `assets/data/custom.geo.js`
- `assets/data/country-game-data.js`
- `assets/data/airport-data.js`
- `assets/data/timezones.geo.js`

JSON/GeoJSON source counterparts are retained for validation and future generation:

- `custom.geo.json`
- `country-game-data.json`
- `timezones.geojson`

When source data changes, regenerate or update its browser wrapper in the same batch. Do not hand-edit only one representation and leave them inconsistent.

Airport data is generated from `assets/data/airports.dat`:

```powershell
node tools/build-airports.mjs
```

Run the data validator afterward.

## Plane model

Runtime model:

```text
assets/plane/medium_haul_plane_low_poly.glb
```

The `.blend` source is not loaded by the browser. Keep it until the asset audit and plane-rendering batch decide whether retaining the editable source is useful.

The GLB model is “Medium haul plane (low poly)” by reeledzin, licensed CC BY 4.0. Preserve attribution.

## Images, landmarks, and icons

- Put core local images under a descriptive subfolder of `assets/images/`.
- Use lowercase, stable, URL-safe file names without spaces where practical.
- Optimize raster images before committing them.
- Record source, author, and license in the relevant README or credits section.
- Provide a local or generated fallback when remote Wikipedia enrichment fails.
- Do not make remote images required for a question to function.

## Vendor files

Third-party browser code belongs under `assets/vendor/`. Preserve license notices. Three.js is currently loaded from a CDN; offline 3D flight support would require a separate decision to vendor it locally.

## Audit workflow

```powershell
node tools/audit-assets.mjs
node tools/audit-assets.mjs --write
```

The optional `--write` form creates `reports/asset-audit.json`. Review `missingReferences`, `dynamicAssets`, and `likelyUnused` before proposing cleanup. False positives are expected for assets loaded through generated paths.

## Batch 3 cleanup record

Removed on June 11, 2026 after direct search, manifest validation, and audit review:

- `assets/images/Earth_map_8k.jpg`: unused texture from the abandoned photographic Viewfinder experiment.
- `assets/data/world-countries.js`: obsolete browser wrapper superseded by `assets/data/custom.geo.js`.
- `assets/data/world-countries.geojson`: obsolete source dataset superseded by `assets/data/custom.geo.json`.

Retained deliberately:

- All country silhouettes, because they remain valuable source assets for outline modes.
- All SVG flags and the upstream metadata/build files, because they preserve provenance and support future flag updates.
- `assets/plane/737-700.blend`, because it is the editable source counterpart to the runtime GLB model.
