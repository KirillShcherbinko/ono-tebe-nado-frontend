import { ICardActions } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { Card } from './../../common/Card';


export class AuctionItem extends Card<HTMLElement> {
  protected _status: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('lot', container, actions);
    this._status = ensureElement<HTMLElement>('.lot__status', container);
  }

  set status (status: HTMLElement) {
    this._status.replaceChildren(status);
  }
}

