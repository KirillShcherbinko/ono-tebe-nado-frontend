import { ILot } from './../../types/index';
import { Model } from '../base/Model';
import _ from 'lodash';

export class BasketModel extends Model<ILot> {
	items: string[] = [];

	toggleItem(id: string, isIncluded: boolean) {
		this.items = isIncluded
			? _.uniq([...this.items, id])
			: _.without(this.items, id);
		this.events.emit('basket:updated', this.items);
	}

	clear() {
		this.items = [];
		this.events.emit('basket:cleared');
	}
}
