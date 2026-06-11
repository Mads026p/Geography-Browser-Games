import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";
import assets from "../asset-paths.js";

const context = { window: {} };
vm.runInNewContext(readFileSync(assets.scripts.data[1], "utf8"), context);
const countries = context.window.COUNTRY_GAME_DATA;

function parseCsv(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) {
      values.push(value);
      value = "";
    } else value += character;
  }
  values.push(value);
  return values;
}

const aliases = {
  "DR Congo": "Democratic Republic of the Congo",
  "Republic of the Congo": "Republic of the Congo",
  "Ivory Coast": "Cote d'Ivoire",
  "Czechia": "Czech Republic",
  "Eswatini": "Swaziland",
  "Myanmar": "Burma",
  "North Korea": "North Korea",
  "South Korea": "South Korea",
  "Cape Verde": "Cape Verde",
  "Timor-Leste": "East Timor",
  "United States": "United States",
  "Vatican City": "Italy",
  "Palestine": "Palestine",
};

const airports = readFileSync(assets.sources.airports, "utf8")
  .trim()
  .split(/\r?\n/)
  .map(parseCsv)
  .map((row) => ({
    name: row[1],
    city: row[2],
    country: row[3],
    iata: row[4] === "\\N" ? "" : row[4],
    lat: Number(row[6]),
    lon: Number(row[7]),
  }))
  .filter((airport) => airport.iata && Number.isFinite(airport.lat) && Number.isFinite(airport.lon));

function distanceSquared(a, b) {
  const lonScale = Math.cos((a.lat * Math.PI) / 180);
  return (a.lat - b.lat) ** 2 + ((a.lon - b.lon) * lonScale) ** 2;
}

const mapped = {};
for (const country of countries) {
  const airportCountry = aliases[country.name] || country.name;
  let candidates = airports.filter((airport) => airport.country === airportCountry);
  if (!candidates.length) candidates = airports;
  const closest = candidates.sort((a, b) => distanceSquared(country, a) - distanceSquared(country, b))[0];
  if (!closest) continue;
  mapped[country.iso2] = closest;
}

writeFileSync(assets.scripts.data[2], `window.AIRPORT_DATA=${JSON.stringify(mapped)};\n`);
