import assert from "node:assert/strict";
import test from "node:test";

import content from "../game-content.js";

test("game content exposes the immutable catalogs used by app modes", () => {
  assert.ok(content.allowedCountryNames instanceof Set);
  assert.ok(content.allowedCountryNames.has("Denmark"));
  assert.ok(content.allowedCountryNames.has("Antarctica"));
  assert.ok(Object.keys(content.triviaExtras).length >= 10);
  assert.ok(content.languageChallenges.length >= 30);
  assert.ok(content.landmarkData.length >= 40);
  assert.equal(content.majorWaterLabels.length, 5);
  assert.ok(content.minorWaterLabels.length >= 8);
  assert.equal(content.offlineUsdRates.USD, 1);
  assert.equal(Object.isFrozen(content), true);
});

test("content catalogs retain representative gameplay entries", () => {
  assert.ok(content.triviaExtras.landmarks.some(([country]) => country === "France"));
  assert.ok(content.languageChallenges.some((challenge) => challenge.language === "Danish"));
  assert.ok(content.landmarkData.some(([name]) => name === "Eiffel Tower"));
  assert.ok(content.majorWaterLabels.some((water) => water.name === "Pacific Ocean"));
});
