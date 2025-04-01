import { Card } from "../../common/Card";
import { BidStatus, ICardActions } from "../../../types";
import { ensureElement, formatNumber } from "../../../utils/utils";

export class BidItem extends Card<BidStatus> {
  protected _status: HTMLElement;
  protected _amount: HTMLElement;
  protected _selector?: HTMLInputElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('bid', container, actions);

    this._status = ensureElement<HTMLElement>('.bid__status', container);
    this._amount = ensureElement<HTMLElement>('.bid__amount', container);
    this._selector = container.querySelector(`.bid__selector-input`);

    if (!this._button && this._selector) {
      this._selector.addEventListener('change', (evt: MouseEvent) => {
        actions?.onClick?.(evt);
      });
    }
  }

  set status({ status, amount }: BidStatus) {
    this.setText(this._amount, formatNumber(amount));

    if (status) this.setVisible(this._status);
    else this.setHidden(this._status);
  }
}