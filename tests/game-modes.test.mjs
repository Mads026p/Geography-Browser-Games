import assert from "node:assert/strict";
import test from "node:test";

import modes from "../game-modes.js";

test("mode registry has unique IDs and canonical globe usage", () => {
  const ids = modes.all.map((mode) => mode.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(modes.get("free").usesGlobe, true);
  assert.equal(modes.get("flags").usesGlobe, false);
  assert.equal(modes.get("viewfinder").usesGlobe, true);
  assert.equal(modes.usesGlobe("outline"), false);
  assert.equal(modes.usesGlobe("daily"), false);
  assert.equal(modes.usesGlobe("gallery"), false);
});

test("daily challenge registry contains the five approved quick modes", () => {
  assert.deepEqual(modes.daily.map((mode) => mode.id), [
    "hunt",
    "flags",
    "trivia",
    "outline",
    "viewfinder",
  ]);
});
