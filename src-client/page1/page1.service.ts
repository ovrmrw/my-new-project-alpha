import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Store } from '../app/store';
import * as types from '../app/types';

@Injectable()
export class AppPage1Service {
  constructor(private http: Http, private store: Store) { }

  getCredential(jsonPath: string) {
    console.log(types.Credential.name);
    console.log(types.Credential.prototype);
    return this.http.get(jsonPath)
      .map(res => res.json() as types.Credential)
      .do(data => this.store.setState(types.Credential, data))
      .toPromise(); // Promiseにして返却しないとViewへの反映がきちんとされない。(OnPushだから?)
  }

  getTranslation(translation: types.Translation) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify(translation);

    return this.http.post('/translation', body, { headers: headers })
      .map(res => res.json().result as types.Translation)
      .do(data => this.store.setState(types.Translation, data))
      .toPromise(); // Promiseにして返却しないとViewへの反映がきちんとされない。(OnPushだから?)
  }

  getHistory(limit: number) {
    return this.store.getStates(types.Translation, limit);
  }
}