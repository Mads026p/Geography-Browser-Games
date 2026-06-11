(function exposeGlobeRendering(globalScope) {
  function renderPolicy({ dragging = false, zooming = false } = {}) {
    const interacting = Boolean(dragging || zooming);
    return {
      interacting,
      drawLabels: !interacting,
      drawMinorBoundaries: !interacting,
      terrainDetail: interacting ? "coarse" : "fine",
    };
  }

  function rounded(value) {
    return Number.isFinite(value) ? Math.round(value * 100000) / 100000 : 0;
  }

  function createViewCacheKey({ yaw, pitch, roll, zoom, width, height, northUp, matrix }) {
    const matrixKey = Array.isArray(matrix) ? matrix.map(rounded).join(",") : "";
    return [
      rounded(yaw),
      rounded(pitch),
      rounded(roll),
      rounded(zoom),
      Math.round(width || 0),
      Math.round(height || 0),
      northUp ? 1 : 0,
      matrixKey,
    ].join("|");
  }

  function rectanglesOverlap(a, b, padding = 0) {
    return (
      Math.abs(a.x - b.x) * 2 < a.width + b.width + padding * 4 &&
      Math.abs(a.y - b.y) * 2 < a.height + b.height + padding * 4
    );
  }

  function placeLabel(candidate, occupied, padding = 4) {
    if (occupied.some((rectangle) => rectanglesOverlap(candidate, rectangle, padding))) return false;
    occupied.push(candidate);
    return true;
  }

  const api = Object.freeze({
    createViewCacheKey,
    placeLabel,
    rectanglesOverlap,
    renderPolicy,
  });

  if (globalScope) globalScope.GeoSphereGlobeRendering = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
