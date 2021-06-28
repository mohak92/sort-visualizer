import { IBar, IAction } from "../Constants/ActionTypes";

export default class Sorter {
    arr: Array<IBar>;

    constructor(array: Array<IBar>) {
        this.arr = array;
    }
}