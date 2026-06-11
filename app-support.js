(function exposeGeoSphereSupport(globalScope) {
  const COUNTRY_ALIASES = Object.freeze({
    "United States": ["usa", "us", "u s", "u s a", "america", "united states of america", "states"],
    "United Kingdom": ["uk", "u k", "great britain", "britain", "kingdom"],
    "United Arab Emirates": ["uae", "u a e", "emirates"],
    "DR Congo": ["drc", "d r c", "congo kinshasa", "democratic republic of the congo"],
    "Republic of the Congo": ["congo brazzaville", "congo republic"],
    "Czechia": ["czech republic"],
    "Netherlands": ["holland"],
    "North Macedonia": ["macedonia", "fyrom"],
    "Ivory Coast": ["cote d ivoire"],
    "Eswatini": ["swaziland"],
    "Timor-Leste": ["east timor", "timor leste"],
    "Myanmar": ["burma"],
    "Cape Verde": ["cabo verde"],
    "Micronesia": ["fsm", "federated states of micronesia"],
    "Vatican City": ["vatican", "holy see"],
    "South Korea": ["korea south", "republic of korea"],
    "North Korea": ["korea north", "dprk"],
    "Turkey": ["turkiye", "türkiye"],
    "Laos": ["lao pdr", "lao peoples democratic republic"],
    "Syria": ["syrian arab republic"],
    "Brunei": ["brunei darussalam"],
    "Russia": ["russian federation"],
  });

  function normalizeCountryText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/^the\s+/, "")
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function countryAliasesFor(countryName) {
    return (COUNTRY_ALIASES[countryName] || []).map(normalizeCountryText);
  }

  function createSafeStorage(storageFactory, onWarning = () => {}) {
    function warn(action, key, error) {
      onWarning(`Could not ${action} saved setting "${key}": ${error?.message || error || "unknown error"}`);
    }

    function withStorage(action, key, fallback, operation) {
      try {
        const storage = storageFactory();
        if (!storage) throw new Error("storage is unavailable");
        return operation(storage);
      } catch (error) {
        warn(action, key, error);
        return fallback;
      }
    }

    return {
      get(key, fallback = null) {
        return withStorage("read", key, fallback, (storage) => storage.getItem(key) ?? fallback);
      },
      getBoolean(key, fallback = false) {
        const value = this.get(key, null);
        if (value === null) return fallback;
        if (value === "true") return true;
        if (value === "false") return false;
        warn("parse", key, new Error("expected true or false"));
        return fallback;
      },
      getNumber(key, fallback = 0) {
        const value = this.get(key, null);
        if (value === null) return fallback;
        const number = Number(value);
        if (Number.isFinite(number)) return number;
        warn("parse", key, new Error("expected a finite number"));
        return fallback;
      },
      getJson(key, fallback) {
        const value = this.get(key, null);
        if (value === null) return fallback;
        try {
          return JSON.parse(value);
        } catch (error) {
          warn("parse", key, error);
          return fallback;
        }
      },
      set(key, value) {
        return withStorage("write", key, false, (storage) => {
          storage.setItem(key, String(value));
          return true;
        });
      },
      setJson(key, value) {
        try {
          return this.set(key, JSON.stringify(value));
        } catch (error) {
          warn("serialize", key, error);
          return false;
        }
      },
    };
  }

  function buildStartupWarnings(runtime) {
    const warnings = [];
    if (!Array.isArray(runtime.COUNTRY_GAME_DATA) || runtime.COUNTRY_GAME_DATA.length === 0) {
      warnings.push("Core country data did not load; game modes may be unavailable.");
    }
    const geometry = runtime.CUSTOM_COUNTRIES_GEOJSON || runtime.WORLD_COUNTRIES_GEOJSON;
    if (!Array.isArray(geometry?.features) || geometry.features.length === 0) {
      warnings.push("Country geometry did not load; the globe cannot draw country borders.");
    }
    if (!runtime.AIRPORT_DATA || Object.keys(runtime.AIRPORT_DATA).length === 0) {
      warnings.push("Airport data did not load; Airport Run may be unavailable.");
    }
    if (!Array.isArray(runtime.TIMEZONE_BOUNDARIES_GEOJSON?.features) || runtime.TIMEZONE_BOUNDARIES_GEOJSON.features.length === 0) {
      warnings.push("Time zone data did not load; the time zone overlay may be unavailable.");
    }
    if (typeof runtime.earcut !== "function") {
      warnings.push("The polygon triangulation library did not load; country rendering may be incomplete.");
    }
    return warnings;
  }

  const api = Object.freeze({
    buildStartupWarnings,
    countryAliasesFor,
    createSafeStorage,
    normalizeCountryText,
  });

  if (globalScope) globalScope.GeoSphereSupport = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
