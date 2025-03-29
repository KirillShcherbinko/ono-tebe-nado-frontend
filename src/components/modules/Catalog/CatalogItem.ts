import clsx from 'clsx';
import { bem, ensureElement } from '../../../utils/utils';
import { Card } from '../../common/Card';
import { ICardActions, LotStatus } from './../../../types/index';

export interface CatalogItemStatus {
	status: LotStatus;
	label: string;
}

export class CatalogItem extends Card<CatalogItemStatus> {
  protected _status: HTMLElement;

  constructor(container: HTMLElement, actions: ICardActions) {
    super('card', container, actions);
    this._status = ensureElement<HTMLElement>('.card__status', container);
  }

  set status({ status, label }: CatalogItemStatus) {
    this.setText(this._status, label);
    const statusClass = bem(this.blockName, 'status', status).name;
    this._status.className = clsx('card__status', {
      [statusClass]: status === 'active' || status === 'closed'
    });
  }
}
