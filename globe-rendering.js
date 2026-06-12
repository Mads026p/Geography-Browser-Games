(function exposeGlobeRendering(globalScope) {
  function renderPolicy({ dragging = false, zooming = false } = {}) {
    const interacting = Boolean(dragging || zooming);
    return {
      interacting,
      drawLabels: true,
      drawMinorBoundaries: !interacting,
      drawCountryBoundaries: true,
      terrainDetail: interacting ? "coarse" : "fine",
    };
  }

  function normalizedHorizonIntersection(current, next, horizon = 0) {
    const denominator = next.z - current.z;
    const t = denominator === 0 ? 0 : (horizon - current.z) / denominator;
    const x = current.x + (next.x - current.x) * t;
    const y = current.y + (next.y - current.y) * t;
    const length = Math.hypot(x, y) || 1;
    const horizonRadius = Math.sqrt(Math.max(0, 1 - horizon * horizon));
    return {
      x: (x / length) * horizonRadius,
      y: (y / length) * horizonRadius,
      z: horizon,
    };
  }

  function clipToVisibleHemisphere(points, horizon = 0) {
    const clipped = [];
    for (let index = 0; index < points.length; index += 1) {
      const current = points[index];
      const next = points[(index + 1) % points.length];
      const currentVisible = current.z >= horizon;
      const nextVisible = next.z >= horizon;
      if (currentVisible) clipped.push(current);
      if (currentVisible !== nextVisible) {
        clipped.push(normalizedHorizonIntersection(current, next, horizon));
      }
    }
    return clipped;
  }

  function expandHorizonPoint(point, radius, overlapPixels = 0.85) {
    if (Math.abs(point.z) > 1e-9 || !Number.isFinite(radius) || radius <= 0) return point;
    const scale = 1 + Math.max(0, overlapPixels) / radius;
    return { x: point.x * scale, y: point.y * scale, z: point.z };
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
    clipToVisibleHemisphere,
    createViewCacheKey,
    expandHorizonPoint,
    placeLabel,
    rectanglesOverlap,
    renderPolicy,
  });

  if (globalScope) globalScope.GeoSphereGlobeRendering = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
