import { CatalogModel } from './CatalogModel';
import { ILot, IOrder, IOrderForm } from './../../types/index';
import { Model } from "../base/Model";
import _ from 'lodash';

export class OrderModel extends Model<ILot> {
  orderData: IOrder = { email: '', phone: '', items: [] }
  
  addItem (id: string) {
    this.orderData.items = _.uniq([...this.orderData.items, id]);
    this.events.emit('order:updated', this.orderData);
  }

  removeItem(id: string) {
    this.orderData.items = _.without(this.orderData.items, id);
    this.events.emit('order:updated', this.orderData);
  }

  clear() {
    this.orderData.items = [];
    this.events.emit('order:cleared');
  }

  getTotal(catalog: CatalogModel) {
    return this.orderData.items.reduce((sum, id) => sum + (catalog.findById(id)?.price || 0), 0);
  }

  setFiled(field: keyof IOrderForm, value: string) {
    this.orderData[field] = value;
    this.events.emit('order:field:updated', { field, value });
  }
}