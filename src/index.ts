import { CatalogItem } from './components/modules/Catalog/CatalogItem';
import { AppState } from './components/models/AppStateModel';
import { Modal } from './components/common/Modal';
import { Catalog } from './components/modules/Catalog/Catalog';
import './scss/styles.scss';

import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardModel } from './components/models/CardModel';
import { ILot } from './types';

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
const appState = new AppState({}, events);

// Глобальные контейнеры
const catalog = new Catalog(document.body);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


// Переиспользуемые части интерфейса


// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно
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
                label: ''
            }, 
        });
    })
})

// Получаем лоты с сервера
api.getLotList()
    .then((lots) => {console.log(lots)})
    .catch(err => console.error(err));
