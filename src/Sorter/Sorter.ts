import { IBar, IAction } from "../Constants/ActionTypes";

export default class Sorter {
  arr: Array<IBar>;

  constructor(array: Array<IBar>) {
    this.arr = array;
  }

  *bubbleSort(): IterableIterator<IAction> {
    let n = this.arr.length;
    let arrayCopy = [...this.arr];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        yield { type: "comparison", first: j, second: j + 1 };
        if (arrayCopy[j].value > arrayCopy[j + 1].value) {
          yield { type: "swap", first: j, second: j + 1 };
          [arrayCopy[j], arrayCopy[j + 1]] = [arrayCopy[j + 1], arrayCopy[j]];
        }
      }
    }
  }

  *selectionSort(): IterableIterator<IAction> {
    let n = this.arr.length;
    let arrayCopy = [...this.arr];
    for (let i = 0; i < n; i++) {
      let indexMin = i;
      for (let j = i + 1; j < n; j++) {
        yield { type: "comparison", first: indexMin, second: j };
        if (arrayCopy[j].value < arrayCopy[indexMin].value) {
          indexMin = j;
        }
      }
      yield { type: "swap", first: indexMin, second: i };
      [arrayCopy[indexMin], arrayCopy[i]] = [arrayCopy[i], arrayCopy[indexMin]];
    }
  }

  *insertionSort(
    left: number = 0,
    right: number = this.arr.length
  ): IterableIterator<IAction> {
    let arrayCopy = [...this.arr];
    for (let i = left + 1; i < right; i++) {
      const x = arrayCopy[i].value;
      let j = i;
      yield { type: "comparison", first: j - 1, second: i };
      while (j > left && arrayCopy[j - 1].value > x) {
        yield { type: "changeValue", index: j, value: arrayCopy[j - 1].value };
        arrayCopy[j].value = arrayCopy[j - 1].value;
        j--;
        // yield compare if next is a comparison
        if (j > left) {
          yield { type: "comparison", first: j - 1, second: i };
        }
      }
      yield { type: "changeValue", index: j, value: x };
      arrayCopy[j].value = x;
    }
  }

  *mergeSort(): IterableIterator<IAction> {
    function* merge(
      arr: Array<IBar>,
      left: number,
      mid: number,
      right: number
    ): IterableIterator<IAction> {
      let start2 = mid + 1;

      if (arr[mid].value <= arr[start2].value) {
        return;
      }

      while (left <= mid && start2 <= right) {
        // If element 1 is in right place
        yield { type: "comparison", first: left, second: start2 };
        if (arr[left].value <= arr[start2].value) {
          left++;
        } else {
          const value = arr[start2].value;
          let index = start2;

          // Shift all the elements between element 1
          // element 2, right by 1.
          while (index !== left) {
            yield { type: "changeValue", index, value: arr[index - 1].value };
            arr[index].value = arr[index - 1].value;
            index--;
          }
          yield { type: "changeValue", index: left, value };
          arr[left].value = value;

          // Update all the pointers
          left++;
          mid++;
          start2++;
        }
      }
    }

    function* _mergeSort(
      arr: Array<IBar>,
      left: number,
      right: number
    ): IterableIterator<IAction> {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        yield* _mergeSort(arr, 0, mid);
        yield* _mergeSort(arr, mid + 1, right);
        yield* merge(arr, left, mid, right);
      }
    }

    const arr = [...this.arr];
    yield* _mergeSort(arr, 0, arr.length - 1);
  }

  *quickSort(): IterableIterator<IAction> {
    function* _quickSort(
      arr: Array<IBar>,
      first: number = 0,
      last: number = arr.length - 1
    ): IterableIterator<IAction> {
      if (first < last) {
        let pivot = arr[last].value;
        let i = first - 1;

        for (let j = first; j < last; j++) {
          yield { type: "comparison", first: j, second: last };
          if (arr[j].value < pivot) {
            i++;
            yield { type: "swap", first: i, second: j };
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
        }
        yield { type: "swap", first: i + 1, second: last };
        [arr[i + 1], arr[last]] = [arr[last], arr[i + 1]];
        pivot = i + 1;
        yield* _quickSort(arr, first, pivot - 1);
        yield* _quickSort(arr, pivot + 1, last);
      }
    }

    const arr = [...this.arr];
    yield* _quickSort(arr);
  }

  countingSort(): Array<number> {
    const arr = [...this.arr];
    const n = arr.length;
    const maxRange = Math.max(...arr.map(v => v.value));
    // grouping values by counts
    let countArr = new Array(maxRange + 1).fill(0);
    for (let i = 0; i < n; i++) {
      countArr[arr[i].value] += 1;
    }
    // cumulative sum in counts
    for (let j = 1; j < countArr.length; j++) {
      countArr[j] += countArr[j - 1];
    }
    // displacing elements to the right
    for (let k = countArr.length - 1; k > 0; k--) {
      countArr[k] = countArr[k - 1];
    }
    countArr[0] = 0;
    let result = new Array(n);
    for (let i = 0; i < n; i++) {
      const toPlace = arr[i].value;
      const placeIndex = countArr[toPlace];
      result[placeIndex] = toPlace;
      countArr[toPlace]++;
    }
    return result;
  }
}
