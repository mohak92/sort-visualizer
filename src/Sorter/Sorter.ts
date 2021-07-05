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
}
