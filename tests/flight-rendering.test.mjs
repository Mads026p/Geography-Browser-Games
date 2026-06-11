import assert from "node:assert/strict";
import test from "node:test";

import flightRendering from "../flight-rendering.js";

const { approachBank, bankTargetForTurn, screenHeadingForTangent, visualPose } = flightRendering;
const closeTo = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} was not within ${tolerance} of ${expected}`);

test("screen heading follows the camera-space travel tangent", () => {
  closeTo(screenHeadingForTangent({ x: 0, y: 1 }), 0);
  closeTo(screenHeadingForTangent({ x: 1, y: 0 }), Math.PI / 2);
  closeTo(screenHeadingForTangent({ x: -1, y: 0 }), -Math.PI / 2);
  closeTo(Math.abs(screenHeadingForTangent({ x: 0, y: -1 })), Math.PI);
});

test("bank target tilts into the turn and clamps input", () => {
  closeTo(bankTargetForTurn(1), Math.PI / 6);
  closeTo(bankTargetForTurn(-1), -Math.PI / 6);
  closeTo(bankTargetForTurn(4), Math.PI / 6);
  closeTo(bankTargetForTurn(0), 0);
});

test("bank smoothing approaches the target without overshooting", () => {
  const first = approachBank(0, Math.PI / 6, 1 / 60);
  assert.ok(first > 0 && first < Math.PI / 6);
  const later = approachBank(first, Math.PI / 6, 0.5);
  assert.ok(later > first && later < Math.PI / 6);
  const leveling = approachBank(later, 0, 0.5);
  assert.ok(leveling >= 0 && leveling < later);
});

test("visual pose combines projected heading and smoothed bank", () => {
  const pose = visualPose({
    cameraTangent: { x: 1, y: 0, z: 0 },
    turn: -1,
    currentBank: 0,
    elapsedSeconds: 0.25,
  });
  closeTo(pose.heading, Math.PI / 2);
  assert.ok(pose.bank < 0);
  assert.ok(pose.bank > -Math.PI / 6);
});
