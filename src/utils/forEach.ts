// Wrote this custom forEach util function, in order to avoid using arr.reverse().forEach() for bids to have the correct order.
// Instead I pass the isReversed optional argument true for bids, and make an optimal reverse forEach loop once (O(n) time complexity)
// instead of reverse().forEach() (which would have O(2n) time complexity). Even though O(n) = O(2n), I guess it's an improvement
// since this function gets called every time the onmessage callback of the socket connection fires with new chunk of data.

/**
 * Iterates over an array and applies a callback function to each element (reversed if isReversed is passed true).
 *
 * @param arr - The array to iterate over.
 * @param cb - The callback function to apply to each element, with parameters (el: T, index: number) => void.
 * @param isReversed - Optional. If true, iterates over the array in reverse order.
 * @template T - The type of elements in the array.
 */
export default function forEach<T>(
  arr: Array<T>,
  cb: (el: T, index: number) => void,
  isReversed = false,
) {
  for (let i = 0; i < arr.length; i++) {
    //if isReversed getting arr elems from back to start
    const ind = isReversed ? arr.length - i - 1 : i;
    cb(arr[ind], i);
  }
}
