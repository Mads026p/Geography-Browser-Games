(function exposeFlightRendering(globalScope) {
  const MAX_BANK_RADIANS = Math.PI / 6;

  function screenHeadingForTangent(cameraTangent) {
    const x = Number(cameraTangent?.x) || 0;
    const y = Number(cameraTangent?.y) || 0;
    if (Math.hypot(x, y) < 1e-8) return 0;
    return Math.atan2(x, y);
  }

  function bankTargetForTurn(turn) {
    const normalizedTurn = Math.max(-1, Math.min(1, Number(turn) || 0));
    return normalizedTurn * MAX_BANK_RADIANS;
  }

  function approachBank(current, target, elapsedSeconds, response = 7) {
    const elapsed = Math.max(0, Number(elapsedSeconds) || 0);
    const alpha = 1 - Math.exp(-response * elapsed);
    return current + (target - current) * alpha;
  }

  function visualPose({ cameraTangent, turn, currentBank = 0, elapsedSeconds = 0 }) {
    const targetBank = bankTargetForTurn(turn);
    return {
      heading: screenHeadingForTangent(cameraTangent),
      bank: approachBank(currentBank, targetBank, elapsedSeconds),
    };
  }

  const api = Object.freeze({
    approachBank,
    bankTargetForTurn,
    screenHeadingForTangent,
    visualPose,
  });

  if (globalScope) globalScope.GeoSphereFlightRendering = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
