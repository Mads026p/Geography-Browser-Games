import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import assets from "../asset-paths.js";

const root = resolve(import.meta.dirname, "..");

test("canonical runtime asset paths point to existing files", () => {
  const paths = [
    assets.scripts.support,
    ...assets.scripts.data,
    assets.scripts.triangulation,
    assets.scripts.app,
    assets.scripts.planeRenderer,
    assets.plane.model,
    assets.sources.countryData,
    assets.sources.countryGeometry,
    assets.sources.airports,
    assets.sources.timezones,
  ];

  paths.forEach((path) => assert.equal(existsSync(resolve(root, path)), true, path));
});

test("country-derived asset paths normalize ISO codes", () => {
  assert.equal(assets.flag("DK"), "assets/Country Flags/svg/dk.svg");
  assert.equal(assets.flag(" xK "), "assets/Country Flags/svg/xk.svg");
  assert.equal(assets.silhouette("DE"), "assets/Country silhouettes/all/de/vector.svg");
  assert.equal(assets.silhouette("US", "1024.png"), "assets/Country silhouettes/all/us/1024.png");
});

test("runtime script order loads support and data before the app", () => {
  assert.deepEqual(assets.runtimeScripts(), [
    "app-support.js",
    "assets/data/custom.geo.js",
    "assets/data/country-game-data.js",
    "assets/data/airport-data.js",
    "assets/data/timezones.geo.js",
    "assets/vendor/earcut.min.js",
    "app.js",
  ]);
});
