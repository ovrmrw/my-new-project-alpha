import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class AppPage1Service {
  constructor(private http: Http) { }

  getCredential(jsonPath: string) {
    return this.http.get(jsonPath)
      .map(res => res.json() as Credential)
      .toPromise();
  }

  getTranslation(translation: Translation) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify(translation);

    return this.http.post('/translation', body, { headers: headers })
      .map(res => res.json().result as Translation)
      .toPromise();
  }
}