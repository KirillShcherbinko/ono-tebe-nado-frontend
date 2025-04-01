import { IOrderForm } from '../../../types';
import { IEvents } from '../../base/events';
import { Form } from './../../common/Form';

export class Order extends Form<IOrderForm> {
  constructor(container: HTMLFormElement, events: IEvents){
    super(container, events);
  }

  set phone(phone: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = phone;
  }

  set email(email: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = email;
  }
}