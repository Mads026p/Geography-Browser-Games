import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const indexHtml = readFileSync(resolve(root, "index.html"), "utf8");
const bootstrapSource = readFileSync(resolve(root, "bootstrap.js"), "utf8");

test("bootstrap is a classic script so index.html works from file URLs", () => {
  assert.match(indexHtml, /<script src="bootstrap\.js"><\/script>/);
  assert.doesNotMatch(indexHtml, /<script type="module" src="bootstrap\.js"><\/script>/);
  assert.doesNotMatch(bootstrapSource, /^\s*await\s/m);
  assert.doesNotMatch(bootstrapSource, /\bimport\s*\(/);
});

test("classic bootstrap writes application scripts in canonical order", () => {
  assert.match(bootstrapSource, /GeoSphereAssets\.runtimeScripts\(\)/);
  assert.match(bootstrapSource, /document\.write/);
  assert.match(bootstrapSource, /planeRenderer/);
});
