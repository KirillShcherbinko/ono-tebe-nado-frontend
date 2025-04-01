import { dayjs, formatNumber } from '../../utils/utils';
import { ILot, LotStatus } from '../../types/index';
import { Model } from "../base/Model";  

export type CatalogChangeEvent = {
  catalog: CardModel[];
};

export class CardModel extends Model<ILot>{
  id: string;

  about: string;
  description: string;
  image: string;
  title: string;

  status: LotStatus;
  datetime: string;
  price: number;
  minPrice: number;
  history: number[];

  protected _lastBid: number = 0;

  // Очистить ставку
  clearBid() {
    this._lastBid = 0;
  }

  // Поставить ставку
  placeBid(price: number) {
    this.price = price;
    this.history = [...this.history.slice(1), price];
    this._lastBid = price;

    if (price > (this.minPrice * 10)) {
      this.status = 'closed';
      this.datetime = dayjs(Date.now()).toString();
    };

    this.emitChanges('auction:changed', { id: this.id, price });
  }

  // Проверка на то, что пользователь сделал ставку
  get isUserBid(): boolean {
    return this._lastBid === this.price;
  }

  // Проверка на наличие участников
  get isParticipate(): boolean {
    return this._lastBid !== 0;
  }

  // Получение статуса аукциона
  get statusLabel(): string {
    switch (this.status) {
      case 'active':
        return `Открыто до ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
      case 'closed':
        return `Закрыто ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
      case 'wait':
        return `Откроется ${dayjs(this.datetime).format('D MMMM [в] HH:mm')}`
      default:
        return this.status;
    }
  }

  // Получение времени акциона
  get timeStatus(): string {
    if (this.status === 'closed') return 'Аукцион завершен';
    else return dayjs
        .duration(dayjs(this.datetime).valueOf() - Date.now())
        .format('D[д] H[ч] m[ мин] s[ сек]');
  }

  // Получение статуса аукциона
  get auctionStatus(): string {
      switch (this.status) {
          case 'closed':
              return `Продано за ${formatNumber(this.price)}₽`;
          case 'wait':
              return 'До начала аукциона';
          case 'active':
              return 'До закрытия лота';
          default:
              return '';
      }
  }

  // Получение следующей ставки
  get nextBid(): number {
      return Math.floor(this.price * 1.1);
  }
}