import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const errors = [];
const warnings = [];

const readText = (path) => readFileSync(resolve(root, path), "utf8");
const normalizeKey = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function duplicateValues(items, selector) {
  const seen = new Map();
  for (const item of items) {
    const value = selector(item);
    if (!value) continue;
    if (!seen.has(value)) seen.set(value, []);
    seen.get(value).push(item);
  }
  return [...seen.entries()].filter(([, matches]) => matches.length > 1);
}

const appSource = readText("app.js");
const indexSource = readText("index.html");
const allowedBlock = appSource.match(/const allowedCountryNames = new Set\(\[(.*?)\]\);/s);
if (!allowedBlock) {
  errors.push("Could not read allowedCountryNames from app.js.");
}
const allowedNames = allowedBlock
  ? [...allowedBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1])
  : [];
const allowedKeys = new Set(allowedNames.map(normalizeKey));

let countries = [];
let geojson = null;
try {
  countries = JSON.parse(readText("assets/data/country-game-data.json"));
  if (!Array.isArray(countries)) throw new Error("Root value is not an array.");
  if (!countries.some((country) => normalizeKey(country.name) === "antarctica")) {
    countries.push({
      name: "Antarctica",
      capital: "South Pole",
      iso2: "AQ",
      iso3: "ATA",
      region: "Antarctica",
      lat: -90,
      lon: 0,
      validationSource: "Synthetic entry defined in app.js",
    });
  }
} catch (error) {
  errors.push(`Could not parse country-game-data.json: ${error.message}`);
}
try {
  geojson = JSON.parse(readText("assets/data/custom.geo.json"));
  if (!Array.isArray(geojson?.features)) throw new Error("FeatureCollection has no features array.");
} catch (error) {
  errors.push(`Could not parse custom.geo.json: ${error.message}`);
}

const countryByKey = new Map(countries.map((country) => [normalizeKey(country.name), country]));
const gameCountries = allowedNames.map((name) => countryByKey.get(normalizeKey(name))).filter(Boolean);

for (const name of allowedNames) {
  if (!countryByKey.has(normalizeKey(name))) errors.push(`Allowed country has no game data: ${name}`);
}

const requiredFields = ["name", "capital", "iso2", "iso3", "region"];
for (const country of gameCountries) {
  for (const field of requiredFields) {
    if (!String(country[field] || "").trim()) errors.push(`${country.name}: missing required field "${field}".`);
  }
  if (!Number.isFinite(country.lat) || country.lat < -90 || country.lat > 90) {
    errors.push(`${country.name}: invalid capital latitude "${country.lat}".`);
  }
  if (!Number.isFinite(country.lon) || country.lon < -180 || country.lon > 180) {
    errors.push(`${country.name}: invalid capital longitude "${country.lon}".`);
  }
  const iso2 = String(country.iso2 || "").toLowerCase();
  const flagPath = resolve(root, "assets", "Country Flags", "svg", `${iso2}.svg`);
  if (!/^[a-z]{2}$/.test(iso2) || !existsSync(flagPath)) {
    errors.push(`${country.name}: missing expected flag assets/Country Flags/svg/${iso2 || "<missing>"}.svg.`);
  }
}

for (const [key, matches] of duplicateValues(countries, (country) => normalizeKey(country.name))) {
  errors.push(`Duplicate country key "${key}": ${matches.map((country) => country.name).join(", ")}`);
}
for (const field of ["iso2", "iso3"]) {
  for (const [iso, matches] of duplicateValues(countries, (country) => String(country[field] || "").toUpperCase())) {
    errors.push(`Duplicate ${field.toUpperCase()} "${iso}": ${matches.map((country) => country.name).join(", ")}`);
  }
}

const modeIds = [...indexSource.matchAll(/data-mode="([^"]+)"/g)].map((match) => match[1]);
for (const [modeId] of duplicateValues(modeIds, (value) => value)) {
  errors.push(`Duplicate mode ID in index.html: ${modeId}`);
}

const geometryIso3 = new Set();
const geometryKeys = new Set();
const featureCountryKeys = [];
for (const feature of geojson?.features || []) {
  const properties = feature.properties || {};
  const iso3 = properties.adm0_a3 || properties.ADM0_A3 || properties.iso_a3 || properties.ISO_A3;
  if (iso3 && iso3 !== "-99") geometryIso3.add(String(iso3).toUpperCase());
  const names = [properties.name, properties.NAME, properties.name_long, properties.NAME_LONG, properties.admin, properties.ADMIN]
    .filter(Boolean)
    .map(normalizeKey);
  names.forEach((name) => geometryKeys.add(name));
  featureCountryKeys.push({ feature, key: names[0], iso3: String(iso3 || "").toUpperCase() });
}

const missingGeometry = gameCountries.filter((country) =>
  !geometryIso3.has(String(country.iso3 || "").toUpperCase()) &&
  !geometryKeys.has(normalizeKey(country.name)),
);
if (missingGeometry.length) {
  warnings.push(`Game countries without a direct geometry match: ${missingGeometry.map((country) => country.name).join(", ")}`);
}

const allowedByIso3 = new Map(gameCountries.map((country) => [String(country.iso3 || "").toUpperCase(), country.name]));
const coordinateOwners = new Map();
function visitCoordinates(value, owner) {
  if (!Array.isArray(value)) return;
  if (value.length >= 2 && Number.isFinite(value[0]) && Number.isFinite(value[1])) {
    const key = `${Number(value[0]).toFixed(2)},${Number(value[1]).toFixed(2)}`;
    if (!coordinateOwners.has(key)) coordinateOwners.set(key, new Set());
    coordinateOwners.get(key).add(owner);
    return;
  }
  value.forEach((child) => visitCoordinates(child, owner));
}
for (const { feature, key, iso3 } of featureCountryKeys) {
  const owner = allowedByIso3.get(iso3) || (allowedKeys.has(key) ? key : null);
  if (owner) visitCoordinates(feature.geometry?.coordinates, owner);
}
const edges = new Set();
for (const owners of coordinateOwners.values()) {
  const names = [...owners];
  for (let i = 0; i < names.length; i += 1) {
    for (let j = i + 1; j < names.length; j += 1) {
      edges.add([names[i], names[j]].sort().join("|"));
    }
  }
}
if (!edges.size) errors.push("Border graph audit produced zero shared-border edges.");

const report = {
  allowedCountries: allowedNames.length,
  sourceCountryRows: countries.filter((country) => !country.validationSource).length,
  validatedGameCountries: gameCountries.length,
  geometryFeatures: geojson?.features?.length || 0,
  flagsFound: gameCountries.length - errors.filter((message) => message.includes("missing expected flag")).length,
  modeIds: modeIds.length,
  approximateBorderEdges: edges.size,
  errors,
  warnings,
};

console.log("GeoSphere data validation");
console.log(`- Allowed countries: ${report.allowedCountries}`);
console.log(`- Country source rows: ${report.sourceCountryRows}`);
console.log(`- Validated game countries: ${report.validatedGameCountries}`);
console.log(`- Geometry features: ${report.geometryFeatures}`);
console.log(`- Expected flags found: ${report.flagsFound}`);
console.log(`- Mode IDs: ${report.modeIds}`);
console.log(`- Approximate shared-border edges: ${report.approximateBorderEdges}`);
warnings.forEach((warning) => console.warn(`WARNING: ${warning}`));
errors.forEach((error) => console.error(`ERROR: ${error}`));

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s).`);
  process.exitCode = 1;
} else {
  console.log("Validation passed.");
}
