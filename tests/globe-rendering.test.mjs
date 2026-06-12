import assert from "node:assert/strict";
import test from "node:test";

import globeRendering from "../globe-rendering.js";

const {
  clipToVisibleHemisphere,
  createViewCacheKey,
  expandHorizonPoint,
  landRenderPolicy,
  placeLabel,
  renderPolicy,
  rectanglesOverlap,
} = globeRendering;

test("render policy reduces nonessential work only during direct interaction", () => {
  assert.deepEqual(renderPolicy({ dragging: false, zooming: false }), {
    interacting: false,
    drawLabels: true,
    drawMinorBoundaries: true,
    drawCountryBoundaries: true,
    terrainDetail: "fine",
  });
  assert.deepEqual(renderPolicy({ dragging: true, zooming: false }), {
    interacting: true,
    drawLabels: true,
    drawMinorBoundaries: false,
    drawCountryBoundaries: true,
    terrainDetail: "coarse",
  });
  assert.equal(renderPolicy({ dragging: false, zooming: true }).interacting, true);
});

test("hemisphere clipping inserts normalized points on the horizon", () => {
  const clipped = clipToVisibleHemisphere([
    { x: 0, y: 0.8, z: 0.6 },
    { x: 0.8, y: 0, z: -0.6 },
    { x: -0.8, y: 0, z: -0.6 },
  ]);

  assert.equal(clipped.length, 3);
  const horizonPoints = clipped.filter((point) => point.z === 0);
  assert.equal(horizonPoints.length, 2);
  horizonPoints.forEach((point) => {
    assert.ok(Math.abs(Math.hypot(point.x, point.y) - 1) < 1e-9);
  });
});

test("horizon fill points expand by a pixel before the globe circle clips them", () => {
  const expanded = expandHorizonPoint({ x: 0.6, y: 0.8, z: 0 }, 200, 1);
  assert.ok(Math.abs(Math.hypot(expanded.x, expanded.y) - 1.005) < 1e-9);
  assert.deepEqual(expandHorizonPoint({ x: 0.6, y: 0.8, z: 0.2 }, 200, 1), {
    x: 0.6,
    y: 0.8,
    z: 0.2,
  });
});

test("timezone rendering neutralizes country surfaces without an extra land pass", () => {
  const normal = landRenderPolicy();
  assert.deepEqual(normal, { countryFillOverride: null });

  const timezones = landRenderPolicy({ showTimezones: true });
  assert.match(timezones.countryFillOverride, /^#[0-9a-f]{6}$/i);
});

test("view cache keys are stable for the same view and change with projection state", () => {
  const view = {
    yaw: 0.123456,
    pitch: -0.234567,
    roll: 0,
    zoom: 1.25,
    width: 900,
    height: 700,
    northUp: true,
    matrix: null,
  };
  assert.equal(createViewCacheKey(view), createViewCacheKey({ ...view }));
  assert.notEqual(createViewCacheKey(view), createViewCacheKey({ ...view, yaw: view.yaw + 0.01 }));
  assert.notEqual(createViewCacheKey(view), createViewCacheKey({ ...view, width: 901 }));
  assert.notEqual(createViewCacheKey(view), createViewCacheKey({ ...view, northUp: false, matrix: [1, 0, 0, 0, 1, 0, 0, 0, 1] }));
});

test("label placement rejects overlapping rectangles and accepts separated labels", () => {
  const occupied = [];
  assert.equal(placeLabel({ x: 100, y: 100, width: 60, height: 18 }, occupied), true);
  assert.equal(placeLabel({ x: 120, y: 104, width: 50, height: 18 }, occupied), false);
  assert.equal(placeLabel({ x: 210, y: 100, width: 50, height: 18 }, occupied), true);
  assert.equal(occupied.length, 2);
});

test("rectangle overlap respects padding", () => {
  const left = { x: 50, y: 50, width: 20, height: 10 };
  const right = { x: 75, y: 50, width: 20, height: 10 };
  assert.equal(rectanglesOverlap(left, right, 0), false);
  assert.equal(rectanglesOverlap(left, right, 3), true);
});
