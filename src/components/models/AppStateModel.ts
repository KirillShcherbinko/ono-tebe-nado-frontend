import { IEvents } from '../base/events';
import { Model } from '../base/Model';
import { CardModel } from './CardModel';
import { CatalogModel } from "./CatalogModel";

export interface IAppState {
	catalog: CatalogModel;
}

export class AppState extends Model<IAppState> {
  catalog: CatalogModel;
  preview: string | null = null;

  constructor(events: IEvents) {
    super({}, events);
    this.catalog = new CatalogModel({}, events);
  }

  setPreview(item: CardModel) {
    this.preview = item.id;
    this.events.emit('preview:changed', item);
  }
}
