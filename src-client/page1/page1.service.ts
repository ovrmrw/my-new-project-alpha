import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Store } from '../app/store';
import { AddState, Credential, Translation } from '../app/types';

@Injectable()
export class AppPage1Service {
  constructor(private http: Http, private store: Store) { }

  getCredential(jsonPath: string) {
    return this.http.get(jsonPath)
      .map(res => res.json() as Credential)
      .do(data => this.store.dispatcher$.next(new AddState(data, Credential)))
      .toPromise(); // Promiseにして返却しないとViewへの反映がきちんとされない。(OnPushだから?)
  }

  getTranslation(translation: Translation) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify(translation);

    return this.http.post('/translation', body, { headers: headers })
      .map(res => res.json().result as Translation)
      .do(data => this.store.dispatcher$.next(new AddState(data, Translation)))
      .toPromise(); // Promiseにして返却しないとViewへの反映がきちんとされない。(OnPushだから?)
  }

  getHistory(limit: number) {
    return this.store.getStates(Translation, limit);
  }
}