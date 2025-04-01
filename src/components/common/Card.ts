import { ICard, ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Card<T> extends Component<ICard<T>> {
  protected _title: HTMLElement;
  protected _description?: HTMLElement;
  protected _image: HTMLImageElement;
  protected _button?: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._description = ensureElement<HTMLElement>(`.${blockName}__description`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
    if (actions) this._button = ensureElement<HTMLButtonElement>(`.${blockName}__action`, container) || null;

    if (this._button) {
      this._button.addEventListener('click', actions.onClick);
    }
  }

  set id(id: string) {
    this.container.dataset.id = id;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(title: string) {
    this.setText(this._title, title);
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set image(image: string) {
    this.setImage(this._image, image, this.title);
  }

  set description(description: string | string[]) {
    if (Array.isArray(description)) {
      const paragraphs = description.map((paragraph) => {
        const clone = this._description?.cloneNode(true) as HTMLElement;
        this.setText(clone, paragraph);
        return clone;
      });

      this._description?.replaceWith(...paragraphs);
    } else {
      if (this._description) this.setText(this._description, description);
    }
  }

  
}