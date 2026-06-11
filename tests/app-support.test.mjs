import assert from "node:assert/strict";
import test from "node:test";

import support from "../app-support.js";

const {
  buildStartupWarnings,
  countryAliasesFor,
  createSafeStorage,
  normalizeCountryText,
} = support;

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
  };
}

test("safe storage returns typed values and defaults for malformed data", () => {
  const warnings = [];
  const storage = createSafeStorage(() =>
    memoryStorage({
      booleanTrue: "true",
      booleanFalse: "false",
      number: "42",
      badNumber: "many",
      json: '["one","two"]',
      badJson: "{broken",
    }), (warning) => warnings.push(warning));

  assert.equal(storage.getBoolean("booleanTrue", false), true);
  assert.equal(storage.getBoolean("booleanFalse", true), false);
  assert.equal(storage.getNumber("number", 0), 42);
  assert.equal(storage.getNumber("badNumber", 7), 7);
  assert.deepEqual(storage.getJson("json", []), ["one", "two"]);
  assert.deepEqual(storage.getJson("badJson", []), []);
  assert.equal(warnings.length, 2);
});

test("safe storage survives denied browser storage and failed writes", () => {
  const warnings = [];
  const storage = createSafeStorage(() => {
    throw new Error("denied");
  }, (warning) => warnings.push(warning));

  assert.equal(storage.get("missing", "fallback"), "fallback");
  assert.equal(storage.set("key", "value"), false);
  assert.equal(warnings.length, 2);
});

test("country aliases cover common abbreviations and alternate names", () => {
  assert.equal(normalizeCountryText("U.S.A."), "u s a");
  assert.ok(countryAliasesFor("United States").includes("usa"));
  assert.ok(countryAliasesFor("United Kingdom").includes("uk"));
  assert.ok(countryAliasesFor("United Arab Emirates").includes("uae"));
  assert.ok(countryAliasesFor("DR Congo").includes("drc"));
  assert.ok(countryAliasesFor("Czechia").includes("czech republic"));
  assert.ok(countryAliasesFor("Netherlands").includes("holland"));
  assert.ok(countryAliasesFor("North Macedonia").includes("macedonia"));
});

test("startup diagnostics report absent or empty required data", () => {
  const warnings = buildStartupWarnings({
    COUNTRY_GAME_DATA: [],
    CUSTOM_COUNTRIES_GEOJSON: null,
    AIRPORT_DATA: {},
    TIMEZONE_BOUNDARIES_GEOJSON: { features: [] },
    earcut: null,
  });

  assert.ok(warnings.some((warning) => /country data/i.test(warning)));
  assert.ok(warnings.some((warning) => /country geometry/i.test(warning)));
  assert.ok(warnings.some((warning) => /airport data/i.test(warning)));
  assert.ok(warnings.some((warning) => /time zone data/i.test(warning)));
  assert.ok(warnings.some((warning) => /polygon triangulation/i.test(warning)));
});

test("startup diagnostics are empty when required globals are populated", () => {
  assert.deepEqual(buildStartupWarnings({
    COUNTRY_GAME_DATA: [{ name: "Denmark" }],
    CUSTOM_COUNTRIES_GEOJSON: { features: [{}] },
    AIRPORT_DATA: { DK: [{}] },
    TIMEZONE_BOUNDARIES_GEOJSON: { features: [{}] },
    earcut: { default() {} },
  }), []);
});
