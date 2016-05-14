import { Injectable } from '@angular/core';

import { Store } from '../app/store';
import { StoreService } from '../app/store.service';
import { AppPage2Service, PAGE_TITLE } from '../page2/page2.service';
import { Translation } from '../../src-middle/types';

@Injectable()
export class AppPage3Service extends StoreService {
  constructor(
    store: Store
  ) { super(store); }

  // Page2のServiceがセットした値を取得する。
  getTitle() { return this.store.getState<string>([PAGE_TITLE, AppPage2Service]); }
  getTitles(limit?: number) { return this.store.getStates<string>([PAGE_TITLE, AppPage2Service], limit); }
  getTitles$(limit?: number) { return this.store.getStates$<string>([PAGE_TITLE, AppPage2Service], limit); }
}