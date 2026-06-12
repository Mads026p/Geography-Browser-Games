# GeoSphere Batches 6 and 7 Design

## Scope

These batches continue the approved incremental cleanup. Batch 6 creates stable data and mode boundaries without rewriting the globe or existing games. Batch 7 adds one new mode, Daily Challenge, plus an experimental achievement-backed flag gallery.

## Batch 6: Structure Cleanup and Border Regression

### Content boundary

Move immutable game catalogs out of `app.js` into `game-content.js`. This module owns:

- allowed country names;
- trivia extras;
- language challenges;
- landmark metadata;
- ocean and water-body labels;
- offline currency reference rates.

The module exposes a frozen `GeoSphereContent` browser global and CommonJS export for Node tests. `app.js` remains responsible for runtime state, rendering, and game behavior.

### Mode boundary

Create `game-modes.js` as the canonical registry for mode IDs, labels, short codes, descriptions, globe usage, and Daily Challenge eligibility. Existing navigation remains static HTML for now, but runtime validation and game-score initialization consume the registry. This is a first extraction, not a navigation rewrite.

### Rotating borders

Country fills may use reduced interaction detail, but country boundaries remain visible during dragging and wheel interaction. The render policy will distinguish labels and terrain detail from boundaries rather than treating all nonessential drawing alike.

### Compatibility

Both direct `file://` startup and the local HTTP server remain supported. The pending direct-file startup repair is committed before Batch 6 so its scope remains separate.

## Batch 7: Daily Challenge and Achievements

### Daily Challenge

Add a non-globe Daily Challenge mode with one scored attempt per local calendar day. A deterministic date seed chooses one challenge from each quick mode:

1. Globe Hunt
2. Flag Sprint
3. Trivia Atlas
4. Outline Twist
5. Viewfinder

To keep the first version reliable, Daily Challenge presents compact adaptations of those modes inside one panel rather than switching the entire application into five existing mode state machines. Each round uses the same country/content sources as its parent mode. The attempt records completion time, correct rounds, hints, round results, and final score. Reloading after completion shows the saved result and does not permit a second scored attempt that day.

Scoring awards 100 points per correct round, reduced by hints and elapsed time. An incorrect answer scores zero for that round but still advances after review. The maximum daily score is 500.

### Progress events

Create `game-progress.js` as a pure progression engine. Existing game completions and Daily Challenge emit normalized progress records through a small adapter in `app.js`. Progress is stored with safe local storage.

Tracked values include:

- games played by mode;
- correct answers by mode;
- best streak by mode;
- fastest correct round;
- no-hint wins;
- Daily Challenges completed;
- perfect Daily Challenges;
- total points earned.

### Achievements and flag rewards

Ship 12 achievements across four rarity tiers. Each achievement permanently unlocks one predetermined flag. Early achievements award familiar flags; rarer, lesser-known flags require stronger performance.

| Achievement | Requirement | Flag |
| --- | --- | --- |
| First Steps | Complete one scored round | Denmark |
| Flag Spotter | Answer 10 Flag Sprint rounds correctly | France |
| Globe Scout | Find 10 Globe Hunt targets | Japan |
| Atlas Apprentice | Answer 20 questions correctly | Brazil |
| Hot Streak | Reach a streak of 5 in any mode | Canada |
| Quick Draw | Correctly finish a quick round in under 8 seconds | Singapore |
| No Help Needed | Win 10 rounds without hints | Bhutan |
| Daily Explorer | Complete 3 Daily Challenges | Comoros |
| Perfect Route | Score 500 in a Daily Challenge | Sao Tome and Principe |
| Marathon Mapper | Play 100 scored rounds | Kiribati |
| Unbroken | Reach a streak of 15 | Tuvalu |
| World Scholar | Earn 5,000 total points | Palau |

Unlock notifications are small and nonblocking.

### Flag Gallery

Add a non-globe Gallery mode. It displays all 12 reward flags in a responsive grid:

- unlocked flags show the real SVG, country name, achievement, and unlock date;
- locked flags show a muted placeholder, rarity, requirement, and current progress;
- summary text shows unlocked count and rarity distribution.

### Testing

Node tests cover content/module integrity, canonical mode metadata, interaction boundary policy, deterministic daily generation, one-attempt storage behavior, score calculation, achievement progress, and idempotent unlocks. Browser smoke tests cover startup, navigation, Daily Challenge rendering, Gallery rendering, and the rotating globe border behavior.

## Non-goals

- No online leaderboard or account synchronization.
- No second Daily Challenge attempt.
- No removal of existing modes.
- No large rewrite of rendering, flight, or complex mode state.
- No asset deletion.
