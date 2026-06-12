(function exposeGeoSphereProgress(globalScope) {
  const DAILY_MODES = Object.freeze(["hunt", "flags", "trivia", "outline", "viewfinder"]);

  function dateSeed(dateKey) {
    let hash = 2166136261;
    for (const character of String(dateKey)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6d2b79f5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function createDailyChallenge(dateKey, countries) {
    const random = seededRandom(dateSeed(dateKey));
    const available = countries.map((_, index) => index);
    const rounds = DAILY_MODES.map((mode, roundIndex) => {
      const pick = Math.floor(random() * available.length);
      const [countryIndex] = available.splice(pick, 1);
      return {
        mode,
        countryIndex,
        variant: Math.floor(random() * 100000),
        round: roundIndex + 1,
      };
    });
    return { dateKey, rounds };
  }

  function scoreDailyRound({ correct, hints = 0, elapsedMs = 0 }) {
    if (!correct) return 0;
    const timePenalty = Math.floor(Math.max(0, elapsedMs) / 10000) * 5;
    return Math.max(40, 100 - Math.max(0, hints) * 15 - timePenalty);
  }

  function dailyAttemptStatus(records, dateKey) {
    const result = records?.[dateKey] || null;
    return { completed: Boolean(result?.completed), result };
  }

  function saveDailyResult(records, dateKey, result) {
    if (records?.[dateKey]?.completed) return records;
    return {
      ...(records || {}),
      [dateKey]: { ...result, completed: true },
    };
  }

  function createProgress() {
    return {
      totalRounds: 0,
      totalCorrect: 0,
      totalPoints: 0,
      noHintWins: 0,
      fastestCorrectMs: null,
      bestStreak: 0,
      dailyCompleted: 0,
      perfectDailies: 0,
      byMode: {},
    };
  }

  function applyProgressEvent(current, event) {
    const progress = {
      ...createProgress(),
      ...(current || {}),
      byMode: { ...(current?.byMode || {}) },
    };
    if (event.type === "round-completed") {
      const mode = progress.byMode[event.mode] || { played: 0, correct: 0 };
      progress.byMode[event.mode] = {
        played: mode.played + 1,
        correct: mode.correct + (event.correct ? 1 : 0),
      };
      progress.totalRounds += 1;
      progress.totalCorrect += event.correct ? 1 : 0;
      progress.totalPoints += Math.max(0, Number(event.points) || 0);
      progress.bestStreak = Math.max(progress.bestStreak, Number(event.streak) || 0);
      if (event.correct && !event.hints) progress.noHintWins += 1;
      if (event.correct && Number.isFinite(event.elapsedMs)) {
        progress.fastestCorrectMs = progress.fastestCorrectMs === null
          ? event.elapsedMs
          : Math.min(progress.fastestCorrectMs, event.elapsedMs);
      }
    }
    if (event.type === "daily-completed") {
      progress.dailyCompleted += 1;
      progress.perfectDailies += event.score === 500 ? 1 : 0;
      progress.totalPoints += Math.max(0, Number(event.score) || 0);
    }
    return progress;
  }

  const achievements = Object.freeze([
    { id: "first-steps", name: "First Steps", description: "Complete one scored round.", rarity: "Common", flagIso2: "dk", flagName: "Denmark", target: 1, value: (p) => p.totalRounds },
    { id: "flag-spotter", name: "Flag Spotter", description: "Answer 10 Flag Sprint rounds correctly.", rarity: "Common", flagIso2: "fr", flagName: "France", target: 10, value: (p) => p.byMode.flags?.correct || 0 },
    { id: "globe-scout", name: "Globe Scout", description: "Find 10 Globe Hunt targets.", rarity: "Common", flagIso2: "jp", flagName: "Japan", target: 10, value: (p) => p.byMode.hunt?.correct || 0 },
    { id: "atlas-apprentice", name: "Atlas Apprentice", description: "Answer 20 scored rounds correctly.", rarity: "Common", flagIso2: "br", flagName: "Brazil", target: 20, value: (p) => p.totalCorrect },
    { id: "hot-streak", name: "Hot Streak", description: "Reach a streak of 5 in any mode.", rarity: "Uncommon", flagIso2: "ca", flagName: "Canada", target: 5, value: (p) => p.bestStreak },
    { id: "quick-draw", name: "Quick Draw", description: "Finish a correct quick round in under 8 seconds.", rarity: "Uncommon", flagIso2: "sg", flagName: "Singapore", target: 1, value: (p) => p.fastestCorrectMs !== null && p.fastestCorrectMs < 8000 ? 1 : 0 },
    { id: "no-help-needed", name: "No Help Needed", description: "Win 10 rounds without using a hint.", rarity: "Rare", flagIso2: "bt", flagName: "Bhutan", target: 10, value: (p) => p.noHintWins },
    { id: "daily-explorer", name: "Daily Explorer", description: "Complete 3 Daily Challenges.", rarity: "Rare", flagIso2: "km", flagName: "Comoros", target: 3, value: (p) => p.dailyCompleted },
    { id: "perfect-route", name: "Perfect Route", description: "Score 500 in a Daily Challenge.", rarity: "Rare", flagIso2: "st", flagName: "Sao Tome and Principe", target: 1, value: (p) => p.perfectDailies },
    { id: "marathon-mapper", name: "Marathon Mapper", description: "Play 100 scored rounds.", rarity: "Epic", flagIso2: "ki", flagName: "Kiribati", target: 100, value: (p) => p.totalRounds },
    { id: "unbroken", name: "Unbroken", description: "Reach a streak of 15.", rarity: "Epic", flagIso2: "tv", flagName: "Tuvalu", target: 15, value: (p) => p.bestStreak },
    { id: "world-scholar", name: "World Scholar", description: "Earn 5,000 total points.", rarity: "Epic", flagIso2: "pw", flagName: "Palau", target: 5000, value: (p) => p.totalPoints },
  ].map(Object.freeze));

  function achievementProgress(achievement, progress) {
    const value = Math.max(0, Number(achievement.value(progress)) || 0);
    return { value, target: achievement.target, complete: value >= achievement.target };
  }

  function evaluateAchievements(progress, existingUnlocks = {}, unlockedAt = new Date().toISOString()) {
    const unlocks = { ...existingUnlocks };
    const newUnlocks = [];
    achievements.forEach((achievement) => {
      if (unlocks[achievement.id] || !achievementProgress(achievement, progress).complete) return;
      unlocks[achievement.id] = unlockedAt;
      newUnlocks.push(achievement);
    });
    return { unlocks, newUnlocks };
  }

  const api = Object.freeze({
    achievements,
    achievementProgress,
    applyProgressEvent,
    createDailyChallenge,
    createProgress,
    dailyAttemptStatus,
    evaluateAchievements,
    saveDailyResult,
    scoreDailyRound,
  });

  if (globalScope) globalScope.GeoSphereProgress = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
