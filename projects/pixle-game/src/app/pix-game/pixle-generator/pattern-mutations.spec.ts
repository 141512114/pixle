import {
  countPlaceholders,
  isValidMutation,
  mirror,
  normalize,
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

  it('rejects a placeholder whose tile touches no equal tile', () =>
    expect(
      isValidMutation(
        [
          [1, 0, 1],
          [1, 0, 0],
          [0, 0, 0],
        ],
        3,
      ),
    ).toBe(false));

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
