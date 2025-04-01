import { Model } from "../base/Model";
import { FormErrors, ILot, IOrder } from "../../types";

export class FormModel extends Model<ILot> {
  errors: FormErrors = {};

  validate(order: IOrder) {
    this.errors = {};
    if (!order.email) this.errors.email = 'Необходимо указать email';
    if (!order.phone) this.errors.phone = 'Необходимо указать телефон';
    this.events.emit('formErrors:change', this.errors);
    return Object.keys(this.errors).length === 0;
  }
}