import { CatalogItem } from './components/modules/Catalog/CatalogItem';
import { AppState } from './components/models/AppStateModel';
import { Modal } from './components/common/Modal';
import { Catalog } from './components/modules/Catalog/Catalog';
import { Auction } from './components/modules/Auction/Auction';
import { AuctionItem } from './components/modules/Auction/AuctionItem';
import './scss/styles.scss';

import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardModel } from './components/models/CardModel';
import { ILot } from './types';
import { CatalogModel } from './components/models/CatalogModel';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

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

// Модель данных приложения
const appState = new AppState(events);
const catalogModel = new CatalogModel({}, events);

// Глобальные контейнеры
const catalog = new Catalog(document.body);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


// Переиспользуемые части интерфейса


// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменения в каталоге
events.on('catalog:changed', () => {
    catalog.items = appState.catalog.items.map(item => {
        const catalogItem = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('item:select', item)
        });
        return catalogItem.render({
            title: item.title,
            image: item.image,
            description: item.about,
            status: {
                status: item.status,
                label: item.statusLabel
            }, 
        });
    })
})

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
                    history: item.history
                });
            }
        });

        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                description: item.description.split("\n"),
                status: auction.render({
                    status: item.status,
                    time: item.timeStatus,
                    label: item.auctionStatus,
                    nextBid: item.nextBid,
                    history: item.history
                })
            })
        });

        if (item.status === 'active') {
            auction.focus();
        }
    };

    if (item) {
        api.getLotItem(item.id)
            .then((result) => {
                item.description = result.description;
                item.history = result.history;
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
});

// Получаем лоты с сервера
api.getLotList()
    .then((lots: ILot[]) => {appState.catalog.items = lots; console.log(lots)})
    .catch(err => console.error(err));
