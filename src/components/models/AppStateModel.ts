import { ILot } from '../../types';
import { Model } from '../base/Model';
import { CatalogModel } from "./CatalogModel";

export interface IAppState {
	catalog: CatalogModel;
}

export class AppState extends Model<IAppState> {
  catalog: CatalogModel = new CatalogModel({}, this.events);
}