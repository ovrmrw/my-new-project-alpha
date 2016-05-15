import { Injectable } from '@angular/core';

import { Store, StoreService } from '../store';
import { AppPage1Service, TRANSLATION_TEXT } from '../page1/page1.service';
import { AppPage2Service, PAGE_TITLE } from '../page2/page2.service';
import { Translation } from '../types';

@Injectable()
export class AppPage3Service extends StoreService {
  constructor(
    store: Store
  ) { super(store); }

  // Page1のServiceがセットした値を取得する。
  getTexts(limit?: number) { return this.store.getStates<string>([TRANSLATION_TEXT, AppPage1Service], limit); }
  
  // Page2のServiceがセットした値を取得する。
  getTitle() { return this.store.getState<string>([PAGE_TITLE, AppPage2Service]); }
  getTitles(limit?: number) { return this.store.getStates<string>([PAGE_TITLE, AppPage2Service], limit); }
  getTitles$(limit?: number) { return this.store.getStates$<string>([PAGE_TITLE, AppPage2Service], limit); }
}