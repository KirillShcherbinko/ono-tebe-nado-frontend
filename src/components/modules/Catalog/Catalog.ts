import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface ICatalog {
  items: HTMLElement[];
}

export class Catalog extends Component<ICatalog> {
  protected _items: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._items = ensureElement<HTMLElement>('.catalog__items');
  }

  set items(items: HTMLElement[]) {
    this._items.replaceChildren(...items);
  }
}