import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const assetsRoot = resolve(root, "assets");
const shouldWrite = process.argv.includes("--write");
const normalizePath = (path) => path.replaceAll("\\", "/").replace(/^\.?\//, "");

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const assetFiles = walk(assetsRoot).map((path) => normalizePath(relative(root, path))).sort();
const sourceExtensions = new Set([".html", ".css", ".js", ".mjs", ".bat"]);
const sourceFiles = walk(root)
  .filter((path) => !path.startsWith(`${assetsRoot}${sep}`))
  .filter((path) => sourceExtensions.has(extname(path).toLowerCase()));

const directReferences = new Map();
const dynamicReferences = [];
const quotedAssetPattern = /["'`](assets[\\/][^"'`\r\n]+)["'`]/g;
const cssAssetPattern = /url\(\s*["']?([^"')]+)["']?\s*\)/g;

for (const sourcePath of sourceFiles) {
  const sourceName = normalizePath(relative(root, sourcePath));
  const text = readFileSync(sourcePath, "utf8");
  for (const match of text.matchAll(quotedAssetPattern)) {
    const value = normalizePath(match[1]);
    if (value.includes("${")) {
      dynamicReferences.push({ source: sourceName, pattern: value });
      continue;
    }
    if (!directReferences.has(value)) directReferences.set(value, []);
    directReferences.get(value).push(sourceName);
  }
  for (const match of text.matchAll(cssAssetPattern)) {
    if (!match[1].startsWith("assets/")) continue;
    const value = normalizePath(match[1]);
    if (!directReferences.has(value)) directReferences.set(value, []);
    directReferences.get(value).push(sourceName);
  }
}

const appSource = readFileSync(resolve(root, "app.js"), "utf8");
const allowedBlock = appSource.match(/const allowedCountryNames = new Set\(\[(.*?)\]\);/s);
const allowedNames = allowedBlock
  ? [...allowedBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1])
  : [];
const countryData = JSON.parse(readFileSync(resolve(assetsRoot, "data", "country-game-data.json"), "utf8"));
const normalizeKey = (value) =>
  String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const countryByKey = new Map(countryData.map((country) => [normalizeKey(country.name), country]));
if (!countryByKey.has("antarctica")) {
  countryByKey.set("antarctica", { name: "Antarctica", iso2: "AQ", iso3: "ATA" });
}
const expectedFlags = allowedNames
  .map((name) => countryByKey.get(normalizeKey(name)))
  .filter(Boolean)
  .map((country) => `assets/Country Flags/svg/${String(country.iso2).toLowerCase()}.svg`);

const knownDynamicAssets = new Set(expectedFlags);
const directlyReferencedAssets = new Set(
  [...directReferences.keys()].filter((path) => assetFiles.includes(path)),
);
const usedAssets = new Set([...knownDynamicAssets, ...directlyReferencedAssets]);

const missingReferences = [...directReferences.keys()]
  .filter((path) => !path.startsWith("http"))
  .filter((path) => !existsSync(resolve(root, path)))
  .map((path) => ({ path, referencedBy: directReferences.get(path) }));
const missingDynamicAssets = [...knownDynamicAssets].filter((path) => !existsSync(resolve(root, path)));
const likelyUnused = assetFiles.filter((path) => !usedAssets.has(path));

const extensionCounts = Object.entries(
  assetFiles.reduce((counts, path) => {
    const extension = extname(path).toLowerCase() || "<none>";
    counts[extension] = (counts[extension] || 0) + 1;
    return counts;
  }, {}),
).sort((a, b) => b[1] - a[1]);

const topLevelCounts = Object.entries(
  assetFiles.reduce((counts, path) => {
    const group = path.split("/").slice(0, 2).join("/");
    counts[group] = (counts[group] || 0) + 1;
    return counts;
  }, {}),
).sort((a, b) => b[1] - a[1]);

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalAssets: assetFiles.length,
    directReferences: directlyReferencedAssets.size,
    knownDynamicAssets: knownDynamicAssets.size,
    missingReferences: missingReferences.length,
    missingDynamicAssets: missingDynamicAssets.length,
    likelyUnused: likelyUnused.length,
  },
  extensionCounts: Object.fromEntries(extensionCounts),
  topLevelCounts: Object.fromEntries(topLevelCounts),
  directReferences: Object.fromEntries(
    [...directReferences.entries()].map(([path, sources]) => [path, [...new Set(sources)].sort()]),
  ),
  dynamicPatterns: dynamicReferences,
  knownDynamicAssets: [...knownDynamicAssets].sort(),
  missingReferences,
  missingDynamicAssets,
  likelyUnused,
  allAssets: assetFiles,
};

console.log("GeoSphere asset audit (non-destructive)");
console.log(`- Total asset files: ${report.summary.totalAssets}`);
console.log(`- Directly referenced assets found: ${report.summary.directReferences}`);
console.log(`- Known dynamic assets: ${report.summary.knownDynamicAssets}`);
console.log(`- Missing direct references: ${report.summary.missingReferences}`);
console.log(`- Missing dynamic assets: ${report.summary.missingDynamicAssets}`);
console.log(`- Likely-unused candidates: ${report.summary.likelyUnused}`);
console.log("- Largest asset groups:");
topLevelCounts.slice(0, 8).forEach(([group, count]) => console.log(`  ${group}: ${count}`));
if (likelyUnused.length) {
  console.log("- Sample likely-unused candidates:");
  likelyUnused.slice(0, 20).forEach((path) => console.log(`  ${path}`));
  console.log(
    shouldWrite
      ? "  Review the JSON report before removing anything."
      : "  Run with --write to create a JSON report before removing anything.",
  );
}
missingReferences.forEach(({ path, referencedBy }) =>
  console.warn(`WARNING: Missing referenced asset ${path} (${referencedBy.join(", ")})`),
);
missingDynamicAssets.forEach((path) => console.warn(`WARNING: Missing expected dynamic asset ${path}`));

if (shouldWrite) {
  const reportPath = resolve(root, "reports", "asset-audit.json");
  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`- Wrote ${normalizePath(relative(root, reportPath))}`);
}

if (missingReferences.length || missingDynamicAssets.length) process.exitCode = 1;
