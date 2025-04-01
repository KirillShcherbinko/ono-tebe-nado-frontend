import { Component } from './../base/Component';
import { IPlug, IPlugActions } from '../../types/index';
import { ensureElement } from '../../utils/utils';

export class Plug extends Component<IPlug> {
  protected _close: HTMLElement;

  constructor(container: HTMLElement, actions: IPlugActions) {
    super(container);
    this._close = ensureElement<HTMLElement>('.state__action', this.container);

    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
    }
  }
}