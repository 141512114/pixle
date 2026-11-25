# Pattern Mutation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mutate Pixle's fixed patterns into new puzzles whose difficulty rises from Monday (level 1) to Sunday (level 7), and show that level in the game and the shared result.

**Architecture:** Pure grid operations (`pattern-mutations.ts`) and a weekday → level table (`difficulty.ts`) are combined in `pixle-generator.ts`, which validates each mutated pattern and retries / falls back deterministically from the date seed. `IPixle` gains `difficulty`; `GameManager` exposes it as a signal for the header and the share text.

**Tech Stack:** Angular 22 (zoneless, signals), TypeScript strict, Vitest via `ng test`.

**Spec:** `docs/superpowers/specs/2026-11-25-pattern-mutation-design.md`

## Global Constraints

- Same day → same puzzle for everyone: all randomness comes from the generator's seeded `random` (never `Math.random`).
- Mutated patterns (levels 2–7): 2 to 5 placeholders, numbered 0..n-1 without gaps; every placeholder covers ≥ 2 tiles and each of its tiles touches (up/down/left/right) another tile with the same placeholder; level 6 needs ≥ 4 placeholders, level 7 exactly 5.
- Level 1 returns the original pattern untouched.
- Sizes: only sizes of existing patterns or their rotation (max 5 rows, max 5 columns).
- Retry up to 20 attempts per level (new base pattern each attempt), then one level lower; levels 6 and 7 use only base patterns of at least 4×4.
- Weekday → level: Mon 1, Tue 2, Wed 3, Thu 4, Fri 5, Sat 6, Sun 7 (`getDay()`, Sunday = 7).
- Indicator text: `Difficulty ` + dots; dots = `●` × level + `○` × (7 − level). Share details line: `<id>/<width>/<height> · <dots>`.
- UI texts in English.

## Review Focus

1. A rotated non-square pattern (5×3 → 3×5, 5×4 → 4×5) must still render and share correctly: width/height come from the tiles, never from the base pattern → covered by the multi-year test checking `tiles` dimensions ≤ 5 and rectangular (Task 4).
2. Gaps in placeholder numbers would map to `undefined` emojis and leave tiles empty → `normalize` test (Task 1) and "every tile maps to an existing icon" over all generated days (Task 4).
3. The fallback must terminate on every date, even when no mutation passes validation → test with a `random` that always returns 0 (Task 4).
4. The header indicator must not show stale or empty dots before the first pixle is generated → indicator hidden while difficulty is 0 (Task 5).
5. The existing midnight behaviour (id and puzzle change together) must survive the new random sequence → existing generator specs stay green (Task 4).

---

### Task 1: Basic grid operations and validator

**Files:**
- Create: `projects/pixle-game/src/app/pix-game/pixle-generator/pattern-mutations.ts`
- Test: `projects/pixle-game/src/app/pix-game/pixle-generator/pattern-mutations.spec.ts`

**Interfaces:**
- Produces:
  - `type Pattern = number[][]`
  - `type Random = () => number` (returns [0, 1))
  - `randomInt(random: Random, max: number, min = 0): number` (inclusive bounds)
  - `mirror(p: Pattern, axis: 'horizontal' | 'vertical'): Pattern`
  - `rotate(p: Pattern, quarterTurns: 1 | 2 | 3): Pattern` (clockwise)
  - `normalize(p: Pattern): Pattern` — renumber placeholders by first appearance (row-major) to 0..n-1
  - `countPlaceholders(p: Pattern): number`
  - `isValidMutation(p: Pattern, level: number): boolean`

All functions are pure and never mutate their input.

- [ ] **Step 1: Write the failing tests**

```ts
const P = [[0, 0, 1], [2, 1, 1]];
it('mirrors horizontally', () => expect(mirror(P, 'horizontal')).toEqual([[1, 0, 0], [1, 1, 2]]));
it('mirrors vertically', () => expect(mirror(P, 'vertical')).toEqual([[2, 1, 1], [0, 0, 1]]));
it('rotates clockwise and swaps dimensions', () => {
  expect(rotate(P, 1)).toEqual([[2, 0], [1, 0], [1, 1]]);
  expect(rotate(rotate(P, 2), 2)).toEqual(P);
});
it('does not mutate the input', () => { const c = structuredClone(P); rotate(P, 1); mirror(P, 'vertical'); expect(P).toEqual(c); });
it('normalizes placeholders by first appearance', () => expect(normalize([[3, 3, 0], [7, 0, 0]])).toEqual([[0, 0, 1], [2, 1, 1]]));
it('counts placeholders', () => expect(countPlaceholders([[0, 2], [2, 4]])).toBe(3));
describe('isValidMutation', () => {
  const ok = [[0, 0, 1, 1], [0, 0, 1, 1], [2, 2, 3, 3], [2, 2, 3, 3]];
  it('accepts connected areas', () => expect(isValidMutation(ok, 3)).toBe(true));
  it('rejects a single tile', () => expect(isValidMutation([[0, 0, 1], [0, 0, 0], [0, 0, 0]], 3)).toBe(false));
  it('rejects a placeholder whose tile touches no equal tile', () =>
    expect(isValidMutation([[1, 0, 1], [1, 0, 0], [0, 0, 0]], 3)).toBe(false));
  it('rejects gaps in numbering', () => expect(isValidMutation([[0, 0], [2, 2]], 3)).toBe(false));
  it('rejects a single placeholder', () => expect(isValidMutation([[0, 0], [0, 0]], 2)).toBe(false));
  it('rejects more than 5 placeholders', () => { /* 6 areas of 2 tiles on a 3x4 grid */
    expect(isValidMutation([[0, 0, 1, 1], [2, 2, 3, 3], [4, 4, 5, 5]], 2)).toBe(false); });
  it('requires >= 4 placeholders on level 6 and exactly 5 on level 7', () => {
    expect(isValidMutation(ok, 6)).toBe(true);
    expect(isValidMutation(ok, 7)).toBe(false);
    expect(isValidMutation([[0, 0, 1, 1, 4], [0, 0, 1, 1, 4], [2, 2, 3, 3, 3], [2, 2, 3, 3, 3]], 7)).toBe(true);
  });
  it('rejects non-rectangular or oversized grids', () => {
    expect(isValidMutation([[0, 0], [1]], 2)).toBe(false);
    expect(isValidMutation(Array.from({ length: 6 }, () => [0, 0, 1, 1]), 2)).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect FAIL** — `npx ng test pixle-game --watch=false` → fails, module `./pattern-mutations` not found.
- [ ] **Step 3: Implement the functions listed under Interfaces.** Size check in `isValidMutation`: non-empty, rectangular, ≤ 5 rows and ≤ 5 columns.
- [ ] **Step 4: Run, expect PASS** — same command, all specs green.
- [ ] **Step 5: Commit** — `git commit -m "Add pattern grid operations and mutation validator (#12)"`

### Task 2: combine and recolour

**Files:**
- Modify: `projects/pixle-game/src/app/pix-game/pixle-generator/pattern-mutations.ts`
- Test: `projects/pixle-game/src/app/pix-game/pixle-generator/pattern-mutations.spec.ts`

**Interfaces:**
- Consumes: Task 1 (`Pattern`, `Random`, `randomInt`, `normalize`, `countPlaceholders`).
- Produces:
  - `combine(a: Pattern, b: Pattern, random: Random): Pattern` — throws `Error` if sizes differ. Picks a split (row boundary, column boundary, or 2×2-block checkerboard); tiles from `b` get their placeholder offset by `countPlaceholders(a)`; result is `reducePlaceholders(normalize(...), 5)`.
  - `reducePlaceholders(p: Pattern, max: number): Pattern` — while more than `max` placeholders: merge the placeholder with the fewest tiles into the placeholder most often adjacent to it; result normalized.
  - `recolour(p: Pattern, random: Random): Pattern` — choose a placeholder, choose one connected region of it (4-neighbourhood), and assign it a different placeholder: a new one (`countPlaceholders(p)`) if fewer than 5 exist and `random() < 0.5`, else a random existing different one; result normalized.

- [ ] **Step 1: Write the failing tests**

```ts
const seq = (...v: number[]) => { let i = 0; return () => v[i++ % v.length]; };
const A = [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1]];
const B = [[0, 1, 0, 1], [0, 1, 0, 1], [0, 1, 0, 1], [0, 1, 0, 1]];
it('combine keeps the size and stays normalized with <= 5 placeholders', () => {
  for (const r of [0, 0.3, 0.6, 0.99]) {
    const c = combine(A, B, seq(r, 0.5));
    expect(c.length).toBe(4); expect(c.every(row => row.length === 4)).toBe(true);
    expect(c).toEqual(normalize(c)); expect(countPlaceholders(c)).toBeLessThanOrEqual(5);
  }
});
it('combine takes tiles from both patterns', () => {
  const c = combine(A, B, seq(0, 0.5)); // first split option: row boundary
  expect(c).not.toEqual(normalize(A)); expect(c).not.toEqual(normalize(B));
});
it('combine rejects different sizes', () => expect(() => combine(A, [[0, 1]], seq(0))).toThrow());
it('reducePlaceholders merges the smallest placeholder into a neighbour', () =>
  expect(reducePlaceholders([[0, 0, 1], [0, 0, 1], [2, 2, 2]], 2)).toEqual([[0, 0, 0], [0, 0, 0], [1, 1, 1]]));
it('recolour changes exactly one connected region and keeps size', () => {
  const r = recolour(A, seq(0, 0, 0.9, 0));
  expect(r.length).toBe(4);
  expect(r.flat().filter((v, i) => v !== normalize(A).flat()[i]).length).toBeGreaterThan(0);
  expect(r).toEqual(normalize(r));
});
it('recolour never exceeds 5 placeholders', () => {
  const five = [[0, 0, 1, 1, 4], [0, 0, 1, 1, 4], [2, 2, 3, 3, 3], [2, 2, 3, 3, 3]];
  for (const x of [0, 0.2, 0.4, 0.6, 0.8]) expect(countPlaceholders(recolour(five, seq(x, 0.1, 0.1, x)))).toBeLessThanOrEqual(5);
});
```

- [ ] **Step 2: Run, expect FAIL** — `npx ng test pixle-game --watch=false` → `combine`/`recolour`/`reducePlaceholders` not exported.
- [ ] **Step 3: Implement the three functions** as described under Interfaces. Split choice in `combine`: `randomInt(random, 2)` → 0 row boundary at `randomInt(random, rows - 1, 1)`, 1 column boundary likewise, 2 checkerboard of 2×2 blocks.
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** — `git commit -m "Add combine and recolour mutations (#12)"`

### Task 3: Weekday difficulty table

**Files:**
- Create: `projects/pixle-game/src/app/pix-game/pixle-generator/difficulty.ts`
- Test: `projects/pixle-game/src/app/pix-game/pixle-generator/difficulty.spec.ts`

**Interfaces:**
- Produces:
  - `type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7`
  - `interface DifficultySettings { mirrorOrRotate: boolean; combine: boolean; recolourings: number; minBaseSize: number }`
  - `DIFFICULTY_SETTINGS: Readonly<Record<DifficultyLevel, DifficultySettings>>` with exactly:
    1 `{false,false,0,0}`, 2 `{true,false,0,0}`, 3 `{true,false,1,0}`, 4 `{false,true,0,0}`, 5 `{false,true,1,0}`, 6 `{false,true,2,4}`, 7 `{false,true,3,4}` (`minBaseSize` = minimum rows and columns of the base pattern)
  - `levelForDate(date: Date): DifficultyLevel`
  - `difficultyDots(level: number): string`

- [ ] **Step 1: Write the failing tests**

```ts
it('maps Monday..Sunday to 1..7', () => {
  // 2026-11-23 is a Monday
  for (let d = 0; d < 7; d++) expect(levelForDate(new Date(2026, 10, 23 + d, 12))).toBe(d + 1);
});
it('formats dots', () => {
  expect(difficultyDots(1)).toBe('●○○○○○○');
  expect(difficultyDots(5)).toBe('●●●●●○○');
  expect(difficultyDots(7)).toBe('●●●●●●●');
});
it('only levels 6 and 7 restrict the base size', () =>
  expect(Object.entries(DIFFICULTY_SETTINGS).filter(([, s]) => s.minBaseSize > 0).map(([l]) => l)).toEqual(['6', '7']));
```

- [ ] **Step 2: Run, expect FAIL** — module `./difficulty` not found.
- [ ] **Step 3: Implement** the table and both functions.
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** — `git commit -m "Add weekday difficulty levels (#12)"`

### Task 4: Mutating generator with fallback

**Files:**
- Modify: `local/typescript/interface/pixle.interface.ts` (add `difficulty: number`)
- Modify: `projects/pixle-game/src/app/pix-game/pixle-generator/pixle-generator.ts`
- Test: `projects/pixle-game/src/app/pix-game/pixle-generator/pixle-generator.spec.ts`

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces:
  - `IPixle.difficulty: number` — level actually generated (1–7).
  - exported `mutatePattern(level: DifficultyLevel, random: Random, patterns: Pattern[] = MASTER_PATTERNS): { tiles: Pattern; level: DifficultyLevel }`
  - `initPixleGenerator()` (default export, unchanged signature) now sets `tiles` from `mutatePattern(levelForDate(today), random)` and `difficulty` from its `level`.

`mutatePattern` algorithm:

```
for level L from `level` down to 2:
  candidates = patterns with rows and columns >= DIFFICULTY_SETTINGS[L].minBaseSize
  if candidates is empty: continue with the next lower level
  repeat 20 times:
    p = random candidate
    if mirrorOrRotate: p = random choice of mirror(h), mirror(v), rotate(1|2|3)
    if combine: q = random candidate; if q's size != p's: q = rotate(q, 1); if still different: q = random other
                candidate of p's size (skip attempt if none); p = combine(p, q, random)
    repeat recolourings times: p = recolour(p, random)
    p = normalize(p)
    if isValidMutation(p, L): return { tiles: p, level: L }
return { tiles: random pattern unchanged, level: 1 }
```

`chooseRandomIcons` must use `countPlaceholders(tiles)` for the icon count (keep its loop as is otherwise).

- [ ] **Step 1: Write the failing tests** (add to the existing spec; keep its existing tests)

```ts
it('stores the level of the weekday', () => {
  expect(pixleAt(new Date(2026, 10, 23, 12)).difficulty).toBe(1); // Monday
  expect(pixleAt(new Date(2026, 10, 29, 12)).difficulty).toBeGreaterThanOrEqual(1);
});
it('returns the original pattern on Mondays', () => {
  const tiles = pixleAt(new Date(2026, 10, 23, 12)).tiles;
  const shape = normalize(tiles); // same icons → same placeholders
  expect(MASTER_PATTERNS.some(p => JSON.stringify(normalize(p)) === JSON.stringify(shape))).toBe(true);
});
it('is deterministic per date', () => {
  const d = new Date(2026, 10, 29, 9);
  expect(pixleAt(d)).toEqual(pixleAt(new Date(2026, 10, 29, 21)));
});
it('generates valid puzzles for three years', () => {
  let fallbacks = 0;
  for (let i = 0; i < 3 * 365; i++) {
    const date = new Date(2024, 9, 18 + i, 12);
    const pixle = pixleAt(date);
    const expected = levelForDate(date);
    expect(pixle.difficulty).toBeLessThanOrEqual(expected);
    if (pixle.difficulty < expected) fallbacks++;
    expect(pixle.tiles.length).toBeLessThanOrEqual(5);
    expect(pixle.tiles.every(r => r.length === pixle.tiles[0].length && r.length <= 5)).toBe(true);
    for (const id of pixle.tiles.flat()) expect(PIXLE_ICONS[id]).toBeDefined();
    if (pixle.difficulty > 1) expect(isValidMutation(normalize(pixle.tiles), pixle.difficulty)).toBe(true);
  }
  console.info(`fallbacks: ${fallbacks} of ${3 * 365}`);
  expect(fallbacks).toBeLessThan(3 * 365 * 0.05);
});
it('terminates with level 1 when nothing passes validation', () => {
  expect(mutatePattern(7, () => 0, [[[0, 1], [1, 0]]])).toEqual({ tiles: [[0, 1], [1, 0]], level: 1 });
});
```

- [ ] **Step 2: Run, expect FAIL** — `difficulty` undefined / `mutatePattern` not exported.
- [ ] **Step 3: Implement** `mutatePattern`, wire it into `generateNewPixle`, add `difficulty` to `IPixle`.
- [ ] **Step 4: Run, expect PASS**, including the three existing generator tests; read the logged fallback share.
- [ ] **Step 5: Commit** — `git commit -m "Mutate patterns by weekday difficulty (#12)"`

### Task 5: Show the difficulty in header and share text

**Files:**
- Modify: `projects/pixle-game/src/app/pix-game/game.manager.ts`
- Modify: `projects/pixle-game/src/app/app.component.ts`, `projects/pixle-game/src/app/app.component.html:37`
- Modify: `local/stylesheets/styles.scss` (`.navbar .game-title` area)
- Test: `projects/pixle-game/src/app/pix-game/game.manager.spec.ts` (create), `projects/pixle-game/src/app/app.component.spec.ts` (create if missing, else extend)

**Interfaces:**
- Consumes: `IPixle.difficulty`, `difficultyDots` (Task 3).
- Produces: `GameManager.difficulty: WritableSignal<number>` (static, initial `0`), set in `generatePixle()`, reset to `0` in nothing else.

- [ ] **Step 1: Write the failing tests**

```ts
// game.manager.spec.ts
it('appends the difficulty to the details line', () => {
  GameManager.pixle_id = 412; GameManager.pixle_image_width = 5; GameManager.pixle_image_height = 5;
  GameManager.difficulty.set(5);
  expect(GameManager.generateShareMessage([]).split('\n').at(-1)).toBe('412/5/5 · ●●●●●○○');
});
it('sets the difficulty when generating a pixle', () => {
  GameManager.generatePixle();
  expect(GameManager.difficulty()).toBeGreaterThanOrEqual(1);
});
// app.component.spec.ts
it('shows the difficulty below the title once known', async () => {
  GameManager.difficulty.set(0);
  const f = TestBed.createComponent(AppComponent); await f.whenStable();
  expect(f.nativeElement.querySelector('.game-difficulty')).toBeNull();
  GameManager.difficulty.set(3); await f.whenStable();
  expect(f.nativeElement.querySelector('.game-difficulty').textContent.trim()).toBe('Difficulty ●●●○○○○');
});
```

- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement.** `generateShareMessage`: details = `` `${id}/${w}/${h} · ${difficultyDots(GameManager.difficulty())}` ``. Header: after the `<h2 … game-title>`, `@if (difficulty() > 0) { <p class="w-100 m-0 text-center game-difficulty" [attr.aria-label]="'Difficulty ' + difficulty() + ' of 7'">Difficulty {{ dots() }}</p> }` with `difficulty = GameManager.difficulty` and `dots = computed(() => difficultyDots(this.difficulty()))` in `AppComponent`. Style `.game-difficulty` small (≈ 13px, `letter-spacing: 1px`, `pointer-events: none`, colour `theme-color(5)`), centred under the title.
- [ ] **Step 4: Run, expect PASS** — `npm test`, then `npm run build pixle-game` without warnings.
- [ ] **Step 5: Check in the browser** — `npx ng serve pixle-game`: indicator under the title, matches today's weekday, share text ends with the dots.
- [ ] **Step 6: Commit** — `git commit -m "Show weekly difficulty in header and share text (#12)"`
