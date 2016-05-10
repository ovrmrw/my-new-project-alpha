import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Store, AddState } from '../app/store';
import { Credential, Translation, ITranslation } from '../../src-middle/types';

@Injectable()
export class AppPage1Service {
  constructor(private http: Http, private store: Store) { }

  getCredential$(jsonPath: string) {
    return this.http.get(jsonPath)
      .map(res => res.json() as Credential)
      .do(data => this.store.dispatcher$.next(new AddState(data, Credential)));
      // .toPromise(); // HttpのレスポンスはPromiseにして返却しないとViewへの反映がきちんとされない？(OnPushだから？)
  }

  getTranslation$(text: string, clientId: string, clientSecret: string) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ text, clientId, clientSecret } as ITranslation);

    return this.http.post('/translation', body, { headers: headers })
      .map(res => res.json().result as Translation)
      .do(data => this.store.dispatcher$.next(new AddState(data, Translation)));
      // .toPromise(); // HttpのレスポンスはPromiseにして返却しないとViewへの反映がきちんとされない？(OnPushだから？)
  }

  getTranslationHistory$(limit?: number) {
    return this.store.getStates$<Translation>(Translation, limit)
      .do(() => console.log('getTranslationHistory$'));
  }
}