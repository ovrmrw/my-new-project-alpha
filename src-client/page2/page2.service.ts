import { Injectable } from '@angular/core';
import { Store } from '../app/store';
// import { StoreService } from '../app/store.service';
import { AppPage1Service } from '../page1/page1.service';
import { Translation } from '../../src-middle/types';

export const TITLE = 'title';

@Injectable()
export class AppPage2Service {
  constructor(
    private store: Store
  ) { }

  setTitle(title: string) { this.store.setState(title, [TITLE, this]); }
  getTitle() { return this.store.getState<string>([TITLE, this]); }
  getTitles$(limit?: number) { return this.store.getStates$<string>(limit, [TITLE, this]); }

  // Page1のServiceがセットした値を取得する。
  getTranslations(limit?: number) { return this.store.getStates<Translation>(limit, [Translation, AppPage1Service]); }
}

// @Injectable()
// export class AppPage2ServiceRef1 {
//   constructor(
//     private page1service: AppPage1Service    
//   ){}

//   getTranslations$(limit?: number) { return this.page1service.getTranslations$(limit); }
// }