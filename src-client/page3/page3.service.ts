import { Injectable } from '@angular/core';

import { Store, StoreService } from '../store';
import { AppPage1Service as AP1S, AppPage2Service as AP2S } from '../services';
import { Translation } from '../types';

@Injectable()
export class AppPage3Service extends StoreService {
  constructor(
    store: Store
  ) { super(store); }

  // Page1のServiceがセットした値を取得する。
  getPage1Texts(limit?: number) { return this.store.getStates<string>(AP1S.TRANSLATION_TEXT_IDENTIFIER, limit); }

  // Page2のServiceがセットした値を取得する。
  getPage2Title() { return this.store.getState<string>(AP2S.PAGE_TITLE_IDENTIFIER); }
  getPage2Titles(limit?: number) { return this.store.getStates<string>(AP2S.PAGE_TITLE_IDENTIFIER, limit); }
  getPage2Titles$(limit?: number) { return this.store.getStates$<string>(AP2S.PAGE_TITLE_IDENTIFIER, limit); }
}