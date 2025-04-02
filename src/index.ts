import { Wrapper } from './components/common/Wrapper';
import { BasketCounter } from './components/modules/Basket/BasketCounter';
import { BasketHeader } from './components/modules/Basket/BasketHeader';
import { Basket } from './components/modules/Basket/Basket';
import { BidItem } from './components/modules/Basket/BidItem';
import { Order } from './components/modules/Order/Order';
import { CatalogItem } from './components/modules/Catalog/CatalogItem';
import { AppState } from './components/models/AppStateModel';
import { Modal } from './components/common/Modal';
import { Tabs } from './components/common/Tabs';
import { Plug } from './components/common/Plug';
import { Catalog } from './components/modules/Catalog/Catalog';
import { Auction } from './components/modules/Auction/Auction';
import { AuctionItem } from './components/modules/Auction/AuctionItem';
import './scss/styles.scss';

import { AuctionAPI } from './components/AuctionAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { CardModel } from './components/models/CardModel';
import { ILot, IOrderForm } from './types';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#preview');
const auctionTemplate = ensureElement<HTMLTemplateElement>('#auction');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#bid');
const bidsTemplate = ensureElement<HTMLTemplateElement>('#bids');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const tabsTemplate = ensureElement<HTMLTemplateElement>('#tabs');
const soldTemplate = ensureElement<HTMLTemplateElement>('#sold');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const emptyTemplate = ensureElement<HTMLTemplateElement>('#empty');

// Модель данных приложения
const appState = new AppState(events);

// Глобальные контейнеры
const basketCounter = new BasketCounter(document.body);
const basketHeader = new BasketHeader(document.body, events);
const catalog = new Catalog(document.body);
const wrapper = new Wrapper(document.body);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const bids = new Basket(cloneTemplate(bidsTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const tabs = new Tabs(cloneTemplate(tabsTemplate), {
	onClick: (name) => {
		if (name === 'closed') events.emit('basket:open');
		else events.emit('bids:open');
	},
});
const order = new Order(cloneTemplate(orderTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно
// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	wrapper.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	wrapper.locked = false;
});

// Изменения в каталоге
events.on('catalog:changed', () => {
	catalog.items = appState.catalog.items.map((item) => {
		const catalogItem = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('item:select', item),
		});
		return catalogItem.render({
			title: item.title,
			image: item.image,
			description: item.about,
			status: {
				status: item.status,
				label: item.statusLabel,
			},
		});
	});
});

// Выбрана карточка
events.on('item:select', (item: CardModel) => {
	appState.setPreview(item);
});

// Изменен открытый выбранный лот
events.on('preview:changed', (item: CardModel) => {
	const showItem = (item: CardModel) => {
		const card = new AuctionItem(cloneTemplate(cardPreviewTemplate));
		const auction = new Auction(cloneTemplate(auctionTemplate), {
			onSubmit: (price: number) => {
				item.placeBid(price);
				auction.render({
					status: item.status,
					time: item.timeStatus,
					label: item.auctionStatus,
					nextBid: item.nextBid,
					history: item.history,
				});
			},
		});

		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				description: item.description.split('\n'),
				status: auction.render({
					status: item.status,
					time: item.timeStatus,
					label: item.auctionStatus,
					nextBid: item.nextBid,
					history: item.history,
				}),
			}),
		});

		if (item.status === 'active') {
			auction.focus();
		}
	};

	if (item) {
		api
			.getLotItem(item.id)
			.then((result) => {
				item.description = result.description;
				item.history = result.history;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

// Зафиксировать изменения в корзине
events.on('auction:changed', () => {
	basketCounter.counter = appState.catalog.closedLots.length;
	bids.items = appState.catalog.activeLots.map((item: CardModel) => {
		const bidItem = new BidItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('preview:changed', item),
		});
		return bidItem.render({
			title: item.title,
			image: item.image,
			status: {
				status: item.isUserBid,
				amount: item.price,
			},
		});
	});
	let total = 0;
	basket.items = appState.catalog.closedLots.map((item: CardModel) => {
		const bidItem = new BidItem(cloneTemplate(soldTemplate), {
			onClick: (event) => {
				const checkbox = event.target as HTMLInputElement;
				const isIncluded = checkbox.checked;
				appState.basket.toggleItem(item.id, isIncluded);
				appState.order.orderData.items = appState.basket.items;
				basket.total = appState.basket.getTotal(appState.catalog);
				basket.selected = appState.basket.items;
			},
		});
		return bidItem.render({
			title: item.title,
			image: item.image,
			status: {
				status: item.isUserBid,
				amount: item.price,
			},
		});
	});
	basket.selected = appState.basket.items;
	basket.total = total;
});

// Открыть активные лоты
events.on('bids:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			tabs.render({
				selected: 'active',
			}),
			bids.render(),
		]),
	});
});

// Открыть закрытые лоты
events.on('basket:open', () => {
	if (!appState.catalog.closedLots.length) {
		const empty = new Plug(cloneTemplate(emptyTemplate), {
			onClick: () => {
				modal.close();
			},
		});

		modal.render({
			content: createElement<HTMLElement>('div', {}, [
				tabs.render({
					selected: 'closed',
				}),
				empty.render({}),
			]),
		});

		return;
	}

	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			tabs.render({
				selected: 'closed',
			}),
			basket.render(),
		]),
	});
});

// Отправлена форма заказа
events.on('order:submit', () => {
	api
		.orderLots(appState.order.orderData)
		.then((result) => {
			const success = new Plug(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			appState.clear();
			basketCounter.counter = 0;
			events.emit('catalog:changed');

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	order.valid = !email && !phone;
	order.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appState.order.setField(data.field, data.value);
		appState.form.validate(appState.order.orderData);
	}
);

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Получаем лоты с сервера
api
	.getLotList()
	.then((lots: ILot[]) => (appState.catalog.items = lots))
	.catch((err) => console.error(err));
