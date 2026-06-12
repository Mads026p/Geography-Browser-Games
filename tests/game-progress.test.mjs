import assert from "node:assert/strict";
import test from "node:test";

import progress from "../game-progress.js";

const countries = Array.from({ length: 200 }, (_, index) => ({
  name: `Country ${index}`,
  iso2: `x${index}`,
}));

test("daily challenge generation is deterministic and uses all five quick modes", () => {
  const first = progress.createDailyChallenge("2026-06-12", countries);
  const second = progress.createDailyChallenge("2026-06-12", countries);
  const nextDay = progress.createDailyChallenge("2026-06-13", countries);

  assert.deepEqual(first, second);
  assert.notDeepEqual(first, nextDay);
  assert.deepEqual(first.rounds.map((round) => round.mode), [
    "hunt",
    "flags",
    "trivia",
    "outline",
    "viewfinder",
  ]);
  assert.equal(new Set(first.rounds.map((round) => round.countryIndex)).size, 5);
});

test("daily scoring rewards correctness and reduces points for hints and time", () => {
  assert.equal(progress.scoreDailyRound({ correct: false, hints: 0, elapsedMs: 1000 }), 0);
  assert.equal(progress.scoreDailyRound({ correct: true, hints: 0, elapsedMs: 5000 }), 100);
  assert.equal(progress.scoreDailyRound({ correct: true, hints: 1, elapsedMs: 25000 }), 75);
  assert.equal(progress.scoreDailyRound({ correct: true, hints: 3, elapsedMs: 120000 }), 40);
});

test("daily records permit only one completed scored attempt per date", () => {
  const records = {};
  assert.equal(progress.dailyAttemptStatus(records, "2026-06-12").completed, false);
  const updated = progress.saveDailyResult(records, "2026-06-12", { score: 420 });
  assert.equal(progress.dailyAttemptStatus(updated, "2026-06-12").completed, true);
  assert.equal(progress.saveDailyResult(updated, "2026-06-12", { score: 500 }), updated);
});

test("progress events accumulate mode and lifetime statistics", () => {
  const initial = progress.createProgress();
  const afterRound = progress.applyProgressEvent(initial, {
    type: "round-completed",
    mode: "flags",
    correct: true,
    points: 1,
    elapsedMs: 7000,
    hints: 0,
    streak: 5,
  });
  const afterDaily = progress.applyProgressEvent(afterRound, {
    type: "daily-completed",
    score: 500,
  });

  assert.equal(afterDaily.totalRounds, 1);
  assert.equal(afterDaily.totalCorrect, 1);
  assert.equal(afterDaily.totalPoints, 501);
  assert.equal(afterDaily.noHintWins, 1);
  assert.equal(afterDaily.fastestCorrectMs, 7000);
  assert.equal(afterDaily.bestStreak, 5);
  assert.equal(afterDaily.byMode.flags.correct, 1);
  assert.equal(afterDaily.dailyCompleted, 1);
  assert.equal(afterDaily.perfectDailies, 1);
});

test("achievement evaluation is idempotent and includes twelve flag rewards", () => {
  const complete = {
    ...progress.createProgress(),
    totalRounds: 100,
    totalCorrect: 20,
    totalPoints: 5000,
    noHintWins: 10,
    fastestCorrectMs: 7000,
    bestStreak: 15,
    dailyCompleted: 3,
    perfectDailies: 1,
    byMode: {
      flags: { played: 10, correct: 10 },
      hunt: { played: 10, correct: 10 },
    },
  };
  const unlocked = progress.evaluateAchievements(complete, {}, "2026-06-12T12:00:00.000Z");
  const repeated = progress.evaluateAchievements(complete, unlocked.unlocks, "2026-06-13T12:00:00.000Z");

  assert.equal(progress.achievements.length, 12);
  assert.equal(unlocked.newUnlocks.length, 12);
  assert.equal(repeated.newUnlocks.length, 0);
  assert.equal(Object.keys(repeated.unlocks).length, 12);
  assert.ok(progress.achievements.some((achievement) => achievement.flagIso2 === "tv"));
});
