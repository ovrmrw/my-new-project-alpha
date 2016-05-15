import { Injectable } from '@angular/core';

import { Store, StoreService } from '../store';
import { AppPage1Service } from '../page1/page1.service';
import { Translation } from '../types';

export const PAGE_TITLE = 'page-title';

@Injectable()
export class AppPage2Service extends StoreService {
  constructor(
    store: Store
  ) { super(store); }

  setTitle(title: string) { this.store.setState(title, [PAGE_TITLE, this]); }
  getTitle() { return this.store.getState<string>([PAGE_TITLE, this]); }
  getTitles$(limit?: number) { return this.store.getStates$<string>([PAGE_TITLE, this], limit); }

  // Page1のServiceがセットした値を取得する。
  getTranslations$(limit?: number) { return this.store.getStates$<Translation>([Translation, AppPage1Service], limit); }
}