import { ILot } from './../../types/index';
import { Model } from '../base/Model';
import _ from 'lodash';
import { CardModel } from './CardModel';
import { CatalogItem } from '../modules/Catalog/CatalogItem';
import { CatalogModel } from './CatalogModel';

export class BasketModel extends Model<ILot> {
	items: string[] = [];

	toggleItem(id: string, isIncluded: boolean) {
		this.items = isIncluded
			? _.uniq([...this.items, id])
			: _.without(this.items, id);
		this.events.emit('basket:updated', this.items);
	}

	getTotal(catalog: CatalogModel) {
		return this.items.reduce((sum, id) => sum + (catalog.findById(id)?.price || 0), 0);
	}
	
	clear() {
		this.items = [];
		this.events.emit('basket:cleared');
	}
}
