import { Injectable } from '@angular/core';

import { Store, StoreService } from '../store';
import { AppPage1Service as AP1S } from '../services';
import { Translation } from '../types';

export const PAGE_TITLE = 'page-title';

@Injectable()
export class AppPage2Service extends StoreService {
  static PAGE_TITLE_IDENTIFIER = [PAGE_TITLE, AppPage2Service];

  constructor(
    store: Store
  ) { super(store); }

  setTitle(title: string) { this.store.setState(title, [PAGE_TITLE, this]); }
  getTitle() { return this.store.getState<string>([PAGE_TITLE, this]); }
  getTitles$(limit?: number) { return this.store.getStates$<string>([PAGE_TITLE, this], limit); }

  // Page1のServiceがセットした値を取得する。
  getPage1Translations$$(limit?: number) { return this.store.getStates$<Translation>(AP1S.TRANSLATION_TEXT_IDENTIFIER, limit); }
}