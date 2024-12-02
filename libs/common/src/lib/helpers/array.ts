type Item = { [key: string]: any };

/**
 * Merges two arrays of objects based on multiple unique keys.
 * Only unique items based on the keys will be added to the resulting array.
 *
 * @param originalArray - The original array of objects.
 * @param newArray - The new array of objects to merge.
 * @param keys - The unique keys to compare objects.
 * @return The merged array with unique items.
 */
export const mergeUniqueItems = <T extends Item>(
  originalArray: T[],
  newArray: T[],
  keys: (keyof T)[]
): T[] => {
  const keyCombination = (item: T) => keys.map((key) => item[key]).join('|');
  const existingCombinations = new Set(originalArray.map(keyCombination));

  const filteredNewArray = newArray.filter(
    (item) => !existingCombinations.has(keyCombination(item))
  );

  return [...originalArray, ...filteredNewArray];
};
