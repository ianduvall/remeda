import type { Simplify } from "type-fest";
import { isDeepEqual } from "./isDeepEqual";
import { purry } from "./purry";

/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param data - The object to test.
 * @param subObject - The sub-object to test against.
 * @signature
 *    R.hasSubObject(data, subObject)
 * @example
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 }) //=> true
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, { b: 4 }) //=> false
 *    R.hasSubObject({ a: 1, b: 2, c: 3 }, {}) //=> true
 * @dataFirst
 * @category Guard
 */
export function hasSubObject<T, S extends Partial<T>>(
  data: T,
  subObject: S,
): // TODO: want to use data is Merge<T, S> here, but it's a typescript error. fix after we allow @ts-expect-error in the build process
data is Simplify<S & T>;

/**
 * Checks if `subObject` is a sub-object of `object`, which means for every
 * property and value in `subObject`, there's the same property in `object`
 * with an equal value. Equality is checked with `isDeepEqual`.
 *
 * @param subObject - The sub-object to test against.
 * @signature
 *    R.hasSubObject(subObject)(data)
 * @example
 *    R.hasSubObject({ a: 1, c: 3 })({ a: 1, b: 2, c: 3 }) //=> true
 *    R.hasSubObject({ b: 4 })({ a: 1, b: 2, c: 3 }) //=> false
 *    R.hasSubObject({})({ a: 1, b: 2, c: 3 }) //=> true
 * @dataLast
 * @category Guard
 */
export function hasSubObject<T, S extends Partial<T>>(
  subObject: S,
): (data: T) => data is Simplify<S & T>;

export function hasSubObject(...args: ReadonlyArray<unknown>): unknown {
  return purry(hasSubObjectImplementation, args);
}

function hasSubObjectImplementation<T extends object, S extends Partial<T>>(
  data: T,
  subObject: S,
): data is Simplify<S & T> {
  for (const [key, value] of Object.entries(subObject)) {
    if (!Object.hasOwn(data, key)) {
      return false;
    }

    if (
      !isDeepEqual(
        value,
        // @ts-expect-error [ts7053] - We already checked that `data` has `key
        data[key],
      )
    ) {
      return false;
    }
  }
  return true;
}
