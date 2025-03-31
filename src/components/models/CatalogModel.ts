import { ILot } from "../../types";
import { Model } from "../base/Model";
import { CardModel } from "./CardModel";

export class CatalogModel extends Model<ILot> {
  protected _items: CardModel[] = [];

  set items(items: ILot[]) {
    this._items = items.map(item => new CardModel(item, this.events));
    this.events.emit('catalog:changed');
  }

  get items (): CardModel[] {
    return this._items;
  }

  get activeLots(): ILot[] {
    return this._items.filter(item => item.status === 'active' && item.isParticipate);
  }

  get closedLots(): ILot[] {
    return this._items.filter(item => item.status === 'closed' && item.isUserBid);
  }

  findById(id: string): CardModel | undefined {
    return this._items.find(item => item.id === id);
  }
}