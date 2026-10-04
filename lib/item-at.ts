// An index that must exist: fixed geometry and tables read by computed
// positions. Throws instead of letting undefined through.
export function itemAt<T>(items: readonly T[], index: number): T {
  const item = items[index];
  if (item === undefined) {
    throw new RangeError(`index ${index} outside 0..${items.length - 1}`);
  }
  return item;
}
