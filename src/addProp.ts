import { purry } from "./purry";

/**
 * Add a new property to an object.
 *
 * @param obj - The target object.
 * @param prop - The property name.
 * @param value - The property value.
 * @signature
 *    R.addProp(obj, prop, value)
 * @example
 *    R.addProp({firstName: 'john'}, 'lastName', 'doe') // => {firstName: 'john', lastName: 'doe'}
 * @dataFirst
 * @category Object
 */
export function addProp<
  T extends Record<PropertyKey, unknown>,
  K extends PropertyKey,
  V,
>(obj: T, prop: K, value: V): T & { [x in K]: V };

/**
 * Add a new property to an object.
 *
 * @param prop - The property name.
 * @param value - The property value.
 * @signature
 *    R.addProp(prop, value)(obj)
 * @example
 *    R.addProp('lastName', 'doe')({firstName: 'john'}) // => {firstName: 'john', lastName: 'doe'}
 * @dataLast
 * @category Object
 */
export function addProp<
  T extends Record<PropertyKey, unknown>,
  K extends PropertyKey,
  V,
>(prop: K, value: V): (obj: T) => T & { [x in K]: V };

export function addProp(...args: ReadonlyArray<unknown>): unknown {
  return purry(addPropImplementation, args);
}

const addPropImplementation = <
  T extends Record<PropertyKey, unknown>,
  K extends PropertyKey,
  V,
>(
  obj: T,
  prop: K,
  value: V,
): T & { [x in K]: V } => ({ ...obj, [prop]: value });
