import { identity } from './identity';
import { intersectionMultiSetBy } from './intersectionMultiSetBy';
import { map } from './map';
import { pipe } from './pipe';
import { prop } from './prop';
import { take } from './take';

describe('with identity', () => {
  it('returns empty array on empty input', () => {
    expect(intersectionMultiSetBy([], [1, 2, 3], identity)).toEqual([]);
  });

  it('removes nothing on empty other array', () => {
    const data = [1, 2, 3];
    expect(intersectionMultiSetBy(data, [], identity)).toEqual(data);
  });

  it('removes an item that is in the input', () => {
    expect(intersectionMultiSetBy([1], [1], identity)).toEqual([]);
  });

  it('doesnt remove items that are not in the other array', () => {
    expect(intersectionMultiSetBy([1], [2], identity)).toEqual([1]);
  });

  it('maintains multi-set semantics (removes only one copy)', () => {
    expect(intersectionMultiSetBy([1, 1], [1], identity)).toEqual([1]);
  });

  it('works if the other array has too many copies', () => {
    expect(intersectionMultiSetBy([1], [1, 1], identity)).toEqual([]);
  });

  it('preserves the original order in source array', () => {
    const result = intersectionMultiSetBy([3, 1, 2, 2], [2], identity);
    expect(result).toEqual([3, 1, 2]);
  });
});

describe('extract prop', () => {
  it('returns empty array on empty input', () => {
    expect(
      intersectionMultiSetBy([], [{ id: 1 }, { id: 2 }, { id: 3 }], prop('id'))
    ).toEqual([]);
  });

  it('removes nothing on empty other array', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(intersectionMultiSetBy(data, [], prop('id'))).toEqual(data);
  });

  it('removes an item that is in the input', () => {
    expect(
      intersectionMultiSetBy([{ id: 1 }], [{ id: 1 }], prop('id'))
    ).toEqual([]);
  });

  it('doesnt remove items that are not in the other array', () => {
    expect(
      intersectionMultiSetBy([{ id: 1 }], [{ id: 2 }], prop('id'))
    ).toEqual([{ id: 1 }]);
  });

  it('maintains multi-set semantics (removes only one copy)', () => {
    expect(
      intersectionMultiSetBy([{ id: 1 }, { id: 1 }], [{ id: 1 }], prop('id'))
    ).toEqual([{ id: 1 }]);
  });

  it('works if the other array has too many copies', () => {
    expect(
      intersectionMultiSetBy([{ id: 1 }], [{ id: 1 }, { id: 1 }], prop('id'))
    ).toEqual([]);
  });

  it('preserves the original order in source array', () => {
    const result = intersectionMultiSetBy(
      [
        { id: 3 },
        { id: 1 },
        { id: 2, subId: 'first' },
        { id: 2, subId: 'second' },
      ],
      [{ id: 2 }],
      prop('id')
    );
    expect(result).toEqual([{ id: 3 }, { id: 1 }, { id: 2, subId: 'second' }]);
  });
});

describe('piping', () => {
  test('lazy', () => {
    const count = vi.fn();
    const result = pipe(
      [1, 2, 3, 4, 5, 6],
      map(x => {
        count();
        return x;
      }),
      intersectionMultiSetBy([2, 3], identity),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([1, 4]);
  });
});

describe('typing', () => {
  it('trivially works with different item types', () => {
    expect(intersectionMultiSetBy([1, 2, 3], ['a', 'b'], identity)).toEqual([
      1, 2, 3,
    ]);
  });

  it('provides scalar func the union of both types', () => {
    intersectionMultiSetBy([1, 2, 3], ['a', 'b'], x => {
      expectTypeOf(x).toEqualTypeOf<string | number>();
      return x;
    });
  });
});
