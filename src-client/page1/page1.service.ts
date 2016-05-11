import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Store } from '../app/store';
import { Credential, Translation, ITranslation } from '../../src-middle/types';
import { AppPage2Service } from '../page2/page2.service';

const TRANSLATION_TEXT = 'translation-text';

@Injectable()
export class AppPage1Service {
  constructor(
    private http: Http,
    private store: Store,
    private page2service: AppPage2Service
  ) { }

  requestCredential$(jsonPath: string) {
    return this.http.get(jsonPath)
      .map(res => res.json() as Credential)
      .do(data => this.store.setState(data, Credential, this));
    // .toPromise(); // HttpのレスポンスはPromiseにして返却しないとViewへの反映がきちんとされない？(OnPushだから？)
  }

  requestTranslation$(text: string, clientId: string, clientSecret: string) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ text, clientId, clientSecret } as ITranslation);

    return this.http.post('/translation', body, { headers: headers })
      .map(res => res.json().result as Translation)
      .do(data => this.store.setState(data, Translation, this));
    // .toPromise(); // HttpのレスポンスはPromiseにして返却しないとViewへの反映がきちんとされない？(OnPushだから？)
  }

  getTranslations$(limit?: number) { return this.store.getStates$<Translation>(limit, Translation, this); }
  getTranslations(limit?: number) { return this.store.getStates<Translation>(limit, Translation, this); }

  setText(text: string) { this.store.setState(text, TRANSLATION_TEXT, this); }
  getText() { return this.store.getState<string>(TRANSLATION_TEXT, this); }

  getTitles$(limit?: number) { return this.page2service.getTitles$(limit); }
  getTitle() { return this.page2service.getTitle(); }
}