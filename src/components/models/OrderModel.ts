import { CatalogModel } from './CatalogModel';
import { ILot, IOrder, IOrderForm } from './../../types/index';
import { Model } from "../base/Model";
import _ from 'lodash';

export class OrderModel extends Model<ILot> {
  orderData: IOrder = { email: '', phone: '', items: [] }

  setField(field: keyof IOrderForm, value: string) {
    this.orderData[field] = value;
    this.events.emit('order:ready', { field, value });
  }
}