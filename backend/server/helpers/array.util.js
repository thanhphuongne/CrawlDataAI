/**
 * Get the common value from 2 arrays
 * @param arr1
 * @param arr2
 * @returns {*[]}
 */
export function getArrayCommon(arr1, arr2) {
  return [...arr1.filter(x => !arr2.includes(x)), ...arr2];
}

/**
 * Delete items from array
 * @param array
 * @param deleteItems
 * @returns {*[]}
 */
export function deleteItemsFromArray(array, deleteItems) {
  deleteItems.forEach((item) => {
    const itemIndex = array.indexOf(item);
    if (itemIndex !== -1) {
      array.splice(itemIndex, 1);
    }
  });
  return array;
}

/**
 * Truncate array
 * @param arr
 * @returns {*[]}
 */
export function truncateArray(arr) {
  const result = [];
  arr.forEach((item) => {
    if (result.indexOf(item) < 0) {
      result.push(item);
    }
  });
  return result;
}

/**
 * Find new items will add to originArray
 * @param originArray
 * @param newArray
 * @returns {*[]}
 */
export function findNewItemsWillAdd(originArray, newArray) {
  const result = [];
  newArray.forEach((item) => {
    if (originArray.indexOf(item) === -1) {
      result.push(item);
    }
  });
  return result;
}
