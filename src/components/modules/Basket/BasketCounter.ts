import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface IBasketCounter {
  counter: number;
}

export class BasketCounter extends Component<IBasketCounter> {
  protected _counter: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
  }

  set counter(counter: number) {
    this.setText(this._counter, String(counter));
  }
}