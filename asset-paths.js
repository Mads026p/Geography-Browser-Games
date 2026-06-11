(function exposeGeoSphereAssets(globalScope) {
  function normalizedIso(iso2) {
    return String(iso2 || "").trim().toLowerCase();
  }

  const assets = Object.freeze({
    scripts: Object.freeze({
      support: "app-support.js",
      data: Object.freeze([
        "assets/data/custom.geo.js",
        "assets/data/country-game-data.js",
        "assets/data/airport-data.js",
        "assets/data/timezones.geo.js",
      ]),
      triangulation: "assets/vendor/earcut.min.js",
      app: "app.js",
      planeRenderer: "plane-renderer.js",
    }),
    sources: Object.freeze({
      countryData: "assets/data/country-game-data.json",
      countryGeometry: "assets/data/custom.geo.json",
      airports: "assets/data/airports.dat",
      timezones: "assets/data/timezones.geojson",
    }),
    plane: Object.freeze({
      model: "assets/plane/medium_haul_plane_low_poly.glb",
      source: "assets/plane/737-700.blend",
    }),
    flag(iso2) {
      return `assets/Country Flags/svg/${normalizedIso(iso2)}.svg`;
    },
    silhouette(iso2, filename = "vector.svg") {
      return `assets/Country silhouettes/all/${normalizedIso(iso2)}/${filename}`;
    },
    runtimeScripts() {
      return [
        this.scripts.support,
        ...this.scripts.data,
        this.scripts.triangulation,
        this.scripts.app,
      ];
    },
  });

  if (globalScope) globalScope.GeoSphereAssets = assets;
  if (typeof module !== "undefined" && module.exports) module.exports = assets;
})(typeof window !== "undefined" ? window : globalThis);
