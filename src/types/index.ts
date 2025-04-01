export type LotStatus = 'wait' | 'active' | 'closed';

export interface IAuction {
	status: LotStatus;
	datetime: string;
	price: number;
	minPrice: number;
	history?: number[];
}

export interface ILotItem {
	id: string;
	title: string;
	about: string;
	description?: string;
	image: string;
}

export type ILot = ILotItem & IAuction;

export type LotUpdate = Pick<
	ILot,
	'id' | 'datetime' | 'status' | 'price' | 'history'
>;

export interface IOrderForm {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IBasket {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export interface BidStatus {
	status: boolean;
	amount: number;
}

export interface IBid {
	price: number;
}

export interface IOrderResult {
	id: string;
}

export interface ICard<T> {
	title: string;
	description?: string | string[];
	image: string;
	status: T;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface AuctionStatus {
  status: string;
  time: string;
  label: string;
  nextBid: number;
  history: number[];
}

export interface IAuctionActions {
	onSubmit: (price: number) => void;
}

export interface TabState {
	selected: string;
}

export interface TabActions {
	onClick: (tab: string) => void;
}

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}