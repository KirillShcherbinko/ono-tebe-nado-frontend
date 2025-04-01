import { Component } from './../base/Component';
import { ISuccess, ISuccessActions } from '../../types/index';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<ISuccess> {
  protected _close: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);
    this._close = ensureElement<HTMLElement>('.state__action', this.container);

    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
    }
  }
}