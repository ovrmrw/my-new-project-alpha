import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Store, StoreService } from '../store';
import { AppPage1Service as AP1S, AppPage2Service as AP2S } from '../services';
import { Translation } from '../types';

@Injectable()
export class AppPage3Service extends StoreService {
  private _state: AppPage3State;
  get state() { return this._state; }

  constructor(store: Store) {
    super(store);
    this._state = new AppPage3State(store, this);
  }

  // Page1のServiceがセットした値を取得する。
  // getPage1Texts(limit?: number) { return this.store.getStates<string>(AP1S.TRANSLATION_TEXT_IDENTIFIER, limit); }

  // Page2のServiceがセットした値を取得する。
  // getPage2Title() { return this.store.getState<string>(AP2S.PAGE_TITLE_IDENTIFIER); }
  // getPage2Titles(limit?: number) { return this.store.getStates<string>(AP2S.PAGE_TITLE_IDENTIFIER, limit); }
  // getPage2Titles$(limit?: number) { return this.store.getStates$<string>(AP2S.PAGE_TITLE_IDENTIFIER, limit); }
}

class AppPage3State {
  texts: string[];
  title: string;
  titles: string[];
  titles$: Observable<string[]>;

  constructor(private store: Store, private service: AppPage3Service) {
    this.texts = this.store.getStates<string>(AP1S.TRANSLATION_TEXT_IDENTIFIER);
    this.title = this.store.getState<string>(AP2S.PAGE_TITLE_IDENTIFIER);
    this.titles = this.store.getStates<string>(AP2S.PAGE_TITLE_IDENTIFIER);
    this.titles$ = this.store.getStates$<string>(AP2S.PAGE_TITLE_IDENTIFIER);
  }
}