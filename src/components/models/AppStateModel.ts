import { FormModel } from './FormModel';
import { OrderModel } from './OrderModel';
import { BasketModel } from './BasketModel';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';
import { CardModel } from './CardModel';
import { CatalogModel } from "./CatalogModel";

export interface IAppState {
	catalog: CatalogModel;
}

export class AppState extends Model<IAppState> {
  basket: BasketModel;
  catalog: CatalogModel;
  form: FormModel;
  order: OrderModel;

  preview: string | null = null;
  loading: boolean = false;

  constructor(events: IEvents) {
    super({}, events);

    this.basket = new BasketModel({}, events); 
    this.catalog = new CatalogModel({}, events);
    this.form = new FormModel({}, events);
    this.order = new OrderModel({}, events);
  }

  setPreview(item: CardModel) {
    this.preview = item.id;
    this.events.emit('preview:changed', item);
  }

  clear() {
    this.order.orderData.items.forEach(id => {
      this.basket.toggleItem(id, false);
      this.catalog.findById(id).clearBid();
    });
  }
}
