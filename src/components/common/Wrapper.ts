import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface IWrapper {
  locked: boolean;
}

export class Wrapper extends Component<IWrapper> {
  protected _wrapper: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
  }

  set locked(locked: boolean) {
    if (locked) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }
}