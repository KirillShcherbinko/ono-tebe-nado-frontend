import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/events";

export class BasketHeader extends Component<{}> {
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._basket = ensureElement<HTMLElement>('.header__basket');
    this._basket.addEventListener('click', () => {
      this.events.emit('bids:open');
    });
  }
}