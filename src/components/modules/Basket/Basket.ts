import { IBasket } from './../../../types/index';
import { createElement, ensureElement, formatNumber } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from '../../base/events';

export class Basket extends Component<IBasket> {
  protected _items: HTMLElement[];
  protected _list: HTMLElement;
  protected _total: HTMLElement | null;
  protected _button: HTMLElement | null;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = this.container.querySelector('.basket__total');
    this._button = this.container.querySelector('.basket__action');
    this.items = [];

    if (this._button) {
      this._button.addEventListener('click', () =>  {
        events.emit('order:open');
      });

      this.items = [];
    }
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
      }));
    }
  }

  set selected(items: string[]) {
    if (this._button) {
      if (items.length) {
        this.setDisabled(this._button, false);
      } else {
        this.setDisabled(this._button, true);
      }
    } 
  }

  set total(total: number) {
    if (this._total) this.setText(this._total, formatNumber(total));
  }
}