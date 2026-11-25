# Pattern mutation with a weekly difficulty curve (#12)

Milestone: v2.2.0

## Intent

Pixle draws each day's puzzle from 30 fixed patterns and only varies the emojis. After about a month
players know every shape. Issue #12 asks to mutate the patterns into new ones so the game gets harder.

Pixle's patterns exist on purpose (README): recognisable shapes make a pixle memorable and keep players
from getting discouraged. Mutation must therefore produce **new but structured** images, not noise.

## Goals

- New pictures every day, built by recombining and recolouring the existing patterns.
- Difficulty rises over the week: Monday is easiest, Sunday hardest.
- Players can see the day's difficulty in the shared result.
- Same day → same puzzle for every player (deterministic from the date, as today).

## Non-goals

- New pattern sizes or more than 5 different emojis per puzzle.
- Hand-curated lists of mutated patterns (considered, rejected; see Approaches).
- An archive of past puzzles or difficulty settings chosen by the player.

## Anti-goals (would be a failure even if it works)

- Puzzles that look like random noise: scattered single tiles without any shape.
- Different players getting different puzzles on the same day.
- An unsolvable or broken puzzle on some date (wrong size, unknown emoji, empty grid).

## Constraints

- Existing patterns have different sizes: 5×5, 5×4, 4×5, 4×4, 5×3 and 3×3 (rows × columns), with
  2 to 5 placeholders (0–4). Some originals contain a placeholder that occurs only once.
- The game reads only `IPixle.tiles` (a `number[][]` of emoji ids); grid, evaluation and share text
  derive everything from its size. Placeholders are replaced by emojis after mutation.
- The seed comes from the local date (`pixle-generator.ts`). Any change to the random sequence changes
  every day's puzzle, including today's, once deployed. Accepted: there is no archive.
- UI texts are English.

## Approaches

1. **Mutation at runtime (chosen).** A chain of small, pure operations (mirror, rotate, combine,
   recolour) between "choose pattern" and "insert emojis". A table per weekday decides which operations
   run. The result is validated; on failure the generator draws again from the same daily random
   sequence, and after a few failures falls back to the next easier level.
   Endless variety, testable by generating years of dates. Risk: an occasional unattractive puzzle
   that still satisfies the rules, mitigated by the shape rule below.
2. **Pre-generated, curated list.** A script produces a few hundred mutated patterns; the owner
   removes bad ones; the rest are stored with a difficulty level. Full control, but a lot of manual
   review, a finite list (repetition returns, only later) and re-curation for every extension.
3. Drawing hard patterns by hand was dropped: it is not mutation and repeats like today.

The owner picked approach 1.

## Decided by the owner

- Mutation strength "B": recombine patterns and recolour areas; mirroring/rotating included as cheap
  extra variation.
- Difficulty increases towards the weekend, per weekday:

  | Day | Level | Operations |
  |-----|-------|------------|
  | Mon | 1 | original pattern, unchanged |
  | Tue | 2 | original, mirrored or rotated |
  | Wed | 3 | as Tue + one area recoloured |
  | Thu | 4 | two patterns combined |
  | Fri | 5 | combined + one area recoloured |
  | Sat | 6 | combined + two areas recoloured, prefers 4–5 emojis |
  | Sun | 7 | combined, several recolourings, always 5 emojis |

- Difficulty is appended as dots to the details line of the shared result (today `412/5/5`), e.g.
  `412/5/5 · ●●●●●○○`. A header indicator below the title was built and then removed at the owner's
  request after seeing it in the browser.

## Rules for every mutated pattern (levels 2–7)

- Same size as one of the existing patterns (a rotation of a non-square pattern swaps rows/columns;
  3×5 and 4×5-style wide grids are allowed).
- At most 5 different placeholders, numbered 0..n-1 without gaps.
- **Shape rule (revised with the owner during implementation):** only what the mutation creates is
  checked. Scattered accents are part of the original art (23 of 30 originals have placeholders
  without touching tiles), so they stay allowed. From level 3 on no placeholder may cover a single
  tile (e.g. cut off by `combine`), and `recolour` only recolours connected areas of at least 2 tiles.
  Level 2 (mirrored or rotated originals) needs no shape check.
- At least 2 different placeholders.
- Level 7 must have exactly 5 placeholders; level 6 must have at least 4.

Level 1 returns the original pattern untouched (originals stay as designed).

## The operations

- **mirror**: horizontal or vertical flip.
- **rotate**: 90°, 180° or 270°.
- **combine(a, b)**: two patterns of the same size (after an optional rotation of `b`). The grid is
  split along a random row or column boundary, or by a checkerboard of 2×2 blocks; each part takes its
  placeholders from one pattern. Placeholders of `b` are offset so they don't collide with `a`, then
  everything is renumbered and reduced to at most 5 placeholders by merging the smallest ones into a
  neighbouring placeholder.
- **recolour**: pick a connected area (one placeholder's connected region, or a 2×2 / row segment
  inside it) and give it a different placeholder — either an existing one or a new one, if the
  placeholder limit allows.

## Generation and fallback

1. Seed from the date (unchanged); level from the weekday (`getDay()`, Sunday = 7).
2. Choose a base pattern; apply the level's operations; validate.
3. If invalid, start over from step 2 (new base pattern) with the next random numbers, up to 20
   attempts, then step down one level and repeat. Level 1 always succeeds.
   Levels 6 and 7 only use base patterns of at least 4×4 (builder's call): with the shape rule a 3×3
   grid fits at most 4 placeholders, and small grids would mostly end in fallbacks.
4. Choose emojis for the placeholders and build `IPixle` as today.

`IPixle` gets a `difficulty: number` (1–7) holding the level that was actually generated.

## Where it lives

- `pixle-generator/pattern-mutations.ts`: the pure operations and the validator.
- `pixle-generator/difficulty.ts`: weekday → level table.
- `pixle-generator.ts`: uses both; the seeded random function is passed into the operations.
- `GameManager` keeps the difficulty; `generateShareMessage` appends it.

## Testing

- Unit tests per operation (mirror/rotate/combine/recolour) on small hand-made grids.
- Validator tests: shape rule, placeholder count, size.
- Generate every day of several years: each result is valid for its level, deterministic per date, uses
  existing emojis, and the level matches the weekday (or is lower only via fallback; fallbacks should
  be rare — the test reports their share).
- Existing generator tests keep passing (id per local day, change at midnight).

## Calls made while writing this (not decided by the owner)

- Placeholder limits, 20 attempts, fallback per level. (The shape rule was revised with the owner.)
- Level 6/7 restricted to base patterns of at least 4×4.
- Difficulty stored in `IPixle.difficulty`.

## Left to the builder

- Exact split strategies and probabilities inside `combine` and `recolour`.
- Whether the level table holds parameters (counts, probabilities) or a list of operations.
