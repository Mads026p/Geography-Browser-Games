(function exposeGeoSphereModes(globalScope) {
  const definitions = [
    { id: "daily", code: "DC", label: "Daily Challenge", description: "One world tour each day", usesGlobe: false },
    { id: "free", code: "FR", label: "Freeroam", description: "Inspect and compare countries", usesGlobe: true },
    { id: "hunt", code: "GH", label: "Globe Hunt", description: "Find countries on the globe", usesGlobe: true, daily: true },
    { id: "distance", code: "DD", label: "Distance Duel", description: "Guess country distances", usesGlobe: true },
    { id: "flags", code: "FS", label: "Flag Sprint", description: "Name the flag quickly", usesGlobe: false, daily: true },
    { id: "trivia", code: "TA", label: "Trivia Atlas", description: "Capitals, regions, facts", usesGlobe: false, daily: true },
    { id: "outline", code: "OT", label: "Outline Twist", description: "Guess the rotated outline", usesGlobe: false, daily: true },
    { id: "viewfinder", code: "VF", label: "Viewfinder", description: "Recognize a borderless globe view", usesGlobe: true, daily: true },
    { id: "airports", code: "AP", label: "Airport Run", description: "Fly to the target airport", usesGlobe: true },
    { id: "language", code: "GL", label: "Guess Language", description: "Identify translated sentences", usesGlobe: false },
    { id: "traverse", code: "CT", label: "Country Traversing", description: "Build a route across land borders", usesGlobe: true },
    { id: "conquest", code: "GC", label: "Globe Conquest", description: "Turn-based geographic strategy", usesGlobe: true },
    { id: "puzzle", code: "CP", label: "Continent Puzzle", description: "Place countries into continents", usesGlobe: false },
    { id: "gallery", code: "FG", label: "Flag Gallery", description: "View achievement rewards", usesGlobe: false },
  ].map(Object.freeze);

  const byId = new Map(definitions.map((mode) => [mode.id, mode]));
  const api = Object.freeze({
    all: Object.freeze(definitions),
    daily: Object.freeze(definitions.filter((mode) => mode.daily)),
    get(id) {
      return byId.get(id) || null;
    },
    usesGlobe(id) {
      return Boolean(byId.get(id)?.usesGlobe);
    },
  });

  if (globalScope) globalScope.GeoSphereModes = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
