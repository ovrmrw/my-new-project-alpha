import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Store, StoreService } from '../store';
import { AppPage1Service as AP1S, AppPage2Service as AP2S } from '../services.ref';
import { Translation } from '../types.ref';

@Injectable()
export class AppPage3Service extends StoreService {
  private _state: AppPage3State;
  get state() { return this._state; }

  constructor(store: Store) {
    super(store);
    this._state = new AppPage3State(store);
  }
}

class AppPage3State {
  constructor(private store: Store) { }
  get texts() { return this.store.getStates<string>(AP1S.TRANSLATION_TEXT_IDENTIFIER); }
  
  get title() { return this.store.getState<string>(AP2S.PAGE_TITLE_IDENTIFIER); }
  get titles() { return this.store.getStates<string>(AP2S.PAGE_TITLE_IDENTIFIER); }
  get titles$() { return this.store.getStates$<string>(AP2S.PAGE_TITLE_IDENTIFIER); }
}