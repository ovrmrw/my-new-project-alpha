import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Store, StoreService } from '../store';
import { AppPage1Service as AP1S, AppPage2Service as AP2S } from '../services';
import { Translation } from '../types';

@Injectable()
export class AppPage4Service extends StoreService {
  private _state: AppPage4State;
  get state() { return this._state; }

  constructor(
    store: Store
  ) {
    super(store);
    this._state = new AppPage4State(store);
  }
}

class AppPage4State {
  text$: Observable<string>;
  title$: Observable<string>;

  constructor(private store: Store) {
    this.text$ = this.store.getState$<string>(AP1S.TRANSLATION_TEXT_IDENTIFIER);
    this.title$ = this.store.getState$<string>(AP2S.PAGE_TITLE_IDENTIFIER);
  }
}