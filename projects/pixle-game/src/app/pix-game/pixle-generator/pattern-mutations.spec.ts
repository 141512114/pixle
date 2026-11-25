import {
  combine,
  countPlaceholders,
  isValidMutation,
  mirror,
  normalize,
  recolour,
  reducePlaceholders,
  rotate,
} from './pattern-mutations';

describe('pattern grid operations', () => {
  const P = [
    [0, 0, 1],
    [2, 1, 1],
  ];

  it('mirrors horizontally', () =>
    expect(mirror(P, 'horizontal')).toEqual([
      [1, 0, 0],
      [1, 1, 2],
    ]));

  it('mirrors vertically', () =>
    expect(mirror(P, 'vertical')).toEqual([
      [2, 1, 1],
      [0, 0, 1],
    ]));

  it('rotates clockwise and swaps dimensions', () => {
    expect(rotate(P, 1)).toEqual([
      [2, 0],
      [1, 0],
      [1, 1],
    ]);
    expect(rotate(rotate(P, 2), 2)).toEqual(P);
  });

  it('does not mutate the input', () => {
    const copy = structuredClone(P);
    rotate(P, 1);
    mirror(P, 'vertical');
    normalize(P);
    expect(P).toEqual(copy);
  });

  it('normalizes placeholders by first appearance', () =>
    expect(
      normalize([
        [3, 3, 0],
        [7, 0, 0],
      ]),
    ).toEqual([
      [0, 0, 1],
      [2, 1, 1],
    ]));

  it('counts placeholders', () =>
    expect(
      countPlaceholders([
        [0, 2],
        [2, 4],
      ]),
    ).toBe(3));
});

describe('isValidMutation', () => {
  const ok = [
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [2, 2, 3, 3],
    [2, 2, 3, 3],
  ];

  it('accepts connected areas', () => expect(isValidMutation(ok, 3)).toBe(true));

  it('rejects a single tile', () =>
    expect(
      isValidMutation(
        [
          [0, 0, 1],
          [0, 0, 0],
          [0, 0, 0],
        ],
        3,
      ),
    ).toBe(false));

  it('accepts scattered tiles as long as the placeholder has a connected pair', () =>
    expect(
      isValidMutation(
        [
          [1, 0, 1],
          [1, 0, 0],
          [0, 0, 0],
        ],
        3,
      ),
    ).toBe(true));

  it('counts diagonal neighbours as a connected pair', () =>
    expect(
      isValidMutation(
        [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 0],
        ],
        3,
      ),
    ).toBe(true));

  it('accepts placeholders with only scattered tiles, like the originals', () =>
    expect(
      isValidMutation(
        [
          [1, 0, 1],
          [0, 0, 0],
          [0, 0, 0],
        ],
        3,
      ),
    ).toBe(true));

  it('allows single tiles on level 2 (mirrored or rotated originals)', () =>
    expect(
      isValidMutation(
        [
          [0, 0, 1],
          [0, 0, 0],
          [0, 0, 0],
        ],
        2,
      ),
    ).toBe(true));

  it('rejects gaps in numbering', () =>
    expect(
      isValidMutation(
        [
          [0, 0],
          [2, 2],
        ],
        3,
      ),
    ).toBe(false));

  it('rejects a single placeholder', () =>
    expect(
      isValidMutation(
        [
          [0, 0],
          [0, 0],
        ],
        2,
      ),
    ).toBe(false));

  it('rejects more than 5 placeholders', () =>
    expect(
      isValidMutation(
        [
          [0, 0, 1, 1],
          [2, 2, 3, 3],
          [4, 4, 5, 5],
        ],
        2,
      ),
    ).toBe(false));

  it('requires >= 4 placeholders on level 6 and exactly 5 on level 7', () => {
    expect(isValidMutation(ok, 6)).toBe(true);
    expect(isValidMutation(ok, 7)).toBe(false);
    expect(
      isValidMutation(
        [
          [0, 0, 1, 1, 4],
          [0, 0, 1, 1, 4],
          [2, 2, 3, 3, 3],
          [2, 2, 3, 3, 3],
        ],
        7,
      ),
    ).toBe(true);
  });

  it('rejects non-rectangular or oversized grids', () => {
    expect(isValidMutation([[0, 0], [1]], 2)).toBe(false);
    expect(
      isValidMutation(
        Array.from({ length: 6 }, () => [0, 0, 1, 1]),
        2,
      ),
    ).toBe(false);
  });
});

describe('combine, reducePlaceholders and recolour', () => {
  const seq = (...values: number[]) => {
    let i = 0;
    return () => values[i++ % values.length];
  };
  const A = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ];
  const B = [
    [0, 1, 0, 1],
    [0, 1, 0, 1],
    [0, 1, 0, 1],
    [0, 1, 0, 1],
  ];

  it('combine keeps the size and stays normalized with <= 5 placeholders', () => {
    for (const r of [0, 0.3, 0.6, 0.99]) {
      const c = combine(A, B, seq(r, 0.5));
      expect(c.length).toBe(4);
      expect(c.every((row) => row.length === 4)).toBe(true);
      expect(c).toEqual(normalize(c));
      expect(countPlaceholders(c)).toBeLessThanOrEqual(5);
    }
  });

  it('combine takes tiles from both patterns', () => {
    const c = combine(A, B, seq(0, 0.5)); // first split option: row boundary
    expect(c).not.toEqual(normalize(A));
    expect(c).not.toEqual(normalize(B));
  });

  it('combine rejects different sizes', () =>
    expect(() => combine(A, [[0, 1]], seq(0))).toThrow());

  it('reducePlaceholders merges the smallest placeholder into a neighbour', () =>
    expect(
      reducePlaceholders(
        [
          [0, 0, 1],
          [0, 0, 1],
          [2, 2, 2],
        ],
        2,
      ),
    ).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [1, 1, 1],
    ]));

  it('recolour changes exactly one connected region and keeps size', () => {
    const r = recolour(A, seq(0, 0, 0.9, 0));
    expect(r.length).toBe(4);
    const before = normalize(A).flat();
    expect(r.flat().filter((v, i) => v !== before[i]).length).toBeGreaterThan(0);
    expect(r).toEqual(normalize(r));
  });

  it('recolour never recolours a single tile', () => {
    // placeholders 1 and 2 are single tiles; only the regions of 0 and 3 may change
    const P = [
      [0, 0, 1],
      [0, 0, 2],
      [3, 3, 3],
    ];
    for (const values of [
      [0.3, 0, 0.9, 0.5],
      [0.6, 0, 0.9, 0.1],
      [0, 0, 0.1, 0],
      [0.9, 0, 0.9, 0.9],
    ]) {
      const r = recolour(P, seq(...values));
      expect(r[0][2]).not.toBe(r[1][2]);
    }
  });

  it('recolour never exceeds 5 placeholders', () => {
    const five = [
      [0, 0, 1, 1, 4],
      [0, 0, 1, 1, 4],
      [2, 2, 3, 3, 3],
      [2, 2, 3, 3, 3],
    ];
    for (const x of [0, 0.2, 0.4, 0.6, 0.8]) {
      expect(countPlaceholders(recolour(five, seq(x, 0.1, 0.1, x)))).toBeLessThanOrEqual(5);
    }
  });
});
