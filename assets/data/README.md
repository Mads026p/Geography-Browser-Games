# Data Sources

- `custom.geo.json` is the canonical country-boundary source used by validation and tooling.
- `custom.geo.js` wraps the same data as `window.CUSTOM_COUNTRIES_GEOJSON` for the browser runtime.
- `country-game-data.json` is the canonical country metadata source; `country-game-data.js` is its browser wrapper.
- `timezones.geojson` is the canonical time-zone boundary source; `timezones.geo.js` is its browser wrapper.
- `airports.dat` is the source used by `tools/build-airports.mjs` to generate `airport-data.js`.

Runtime and source paths are centralized in `asset-paths.js`.
