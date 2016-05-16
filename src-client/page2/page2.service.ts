import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Store, StoreService } from '../store';
import { AppPage1Service as AP1S } from '../services.ref';
import { Translation } from '../types.ref';

const PAGE_TITLE = 'page-title';

@Injectable()
export class AppPage2Service extends StoreService {
  static PAGE_TITLE_IDENTIFIER = [PAGE_TITLE, AppPage2Service];

  private _state: AppPage2State;
  get state() { return this._state; }

  constructor(store: Store) {
    super(store);
    this._state = new AppPage2State(store);
  }

  setTitle(title: string) { this.store.setState(title, [PAGE_TITLE, this]); }
}

const AP2S = AppPage2Service;

class AppPage2State {
  constructor(private store: Store) { }
  get title() { return this.store.getState<string>(AP2S.PAGE_TITLE_IDENTIFIER); }
  get titles$() { return this.store.getStates$<string>(AP2S.PAGE_TITLE_IDENTIFIER); }

  get translations$$() { return this.store.getStates$<Translation>(AP1S.TRANSLATION_IDENTIFIER); }
}