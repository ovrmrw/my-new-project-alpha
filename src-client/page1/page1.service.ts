import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Store, StoreService } from '../store';
import { Credential, Translation, ITranslation } from '../types.ref';
import { AppPage2Service as AP2S } from '../services.ref';

const TRANSLATION_TEXT = 'translation-text';

@Injectable()
export class AppPage1Service extends StoreService {
  static TRANSLATION_IDENTIFIER = [Translation, AppPage1Service];
  static TRANSLATION_TEXT_IDENTIFIER = [TRANSLATION_TEXT, AppPage1Service];

  private _state: AppPage1State;
  get state() { return this._state; }

  constructor(
    store: Store,
    private http: Http
  ) {
    super(store);
    this._state = new AppPage1State(store);
  }

  requestCredential$$(jsonPath: string) {
    return this.http.get(jsonPath)
      .map(res => res.json() as Credential)
      .do(data => this.store.setState(data, [Credential, this]));
  }

  requestTranslation$$(text: string, clientId: string, clientSecret: string) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ text, clientId, clientSecret } as ITranslation);

    return this.http.post('/translation', body, { headers: headers })
      .map(res => res.json().result as Translation)
      .do(data => this.store.setState(data, AP1S.TRANSLATION_IDENTIFIER));
  }

  setText(text: string) { this.store.setState(text, AP1S.TRANSLATION_TEXT_IDENTIFIER); }
}

const AP1S = AppPage1Service;

class AppPage1State {
  constructor(private store: Store) { }
  get text() { return this.store.getState<string>(AP1S.TRANSLATION_TEXT_IDENTIFIER); }

  get translations() { return this.store.getStates<Translation>(AP1S.TRANSLATION_IDENTIFIER); }
  get translations$$() { return this.store.getStates$<Translation>(AP1S.TRANSLATION_IDENTIFIER); }

  get title() { return this.store.getState<string>(AP2S.PAGE_TITLE_IDENTIFIER); }
  get titles$() { return this.store.getStates$<string>(AP2S.PAGE_TITLE_IDENTIFIER); }
}