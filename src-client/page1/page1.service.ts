import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Store, StoreService } from '../store';
import { Credential, Translation, ITranslation } from '../types';
import { AppPage2Service as AP2S } from '../services';

const TRANSLATION_TEXT = 'translation-text';

@Injectable()
export class AppPage1Service extends StoreService {
  static TRANSLATION_IDENTIFIER = [Translation, AppPage1Service];
  static TRANSLATION_TEXT_IDENTIFIER = [TRANSLATION_TEXT, AppPage1Service];
  
  constructor(
    store: Store,
    private http: Http
  ) { super(store); }

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
      .do(data => this.store.setState(data, [Translation, this]));
  }

  getTranslations(limit?: number) { return this.store.getStates<Translation>([Translation, this], limit); }
  getTranslations$$(limit?: number) { return this.store.getStates$<Translation>([Translation, this], limit); }

  setText(text: string) { this.store.setState(text, [TRANSLATION_TEXT, this]); }
  getText() { return this.store.getState<string>([TRANSLATION_TEXT, this]); }

  // Page2のServiceがセットした値を取得する。  
  getPage2Title() { return this.store.getState<string>(AP2S.PAGE_TITLE_IDENTIFIER); }
  getPage2Titles$(limit?: number) { return this.store.getStates$<string>(AP2S.PAGE_TITLE_IDENTIFIER, limit); }
}