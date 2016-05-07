import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Http, Request, Response, Headers, RequestOptions } from '@angular/http';
import path from 'path';

import {Dispatcher} from '../flux/flux-di';
import {Container} from '../flux/flux-container';
import {Action, NextTranslate} from '../flux/flux-action';


const appRoot = path.resolve(__dirname, '..');
console.log('Application Root: ' + appRoot);

///////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'my-name',
  template: `
    <div><h3>{{text}}</h3></div>
  `
})
class Name {
  @Input() text: string;
}

///////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'my-page1',
  template: `
    <div>
      ClientId: <input type="text" [(ngModel)]="clientId" />
    </div>
    <div>
      ClientSecret: <input type="text" [(ngModel)]="clientSecret" />
    </div>
    <hr />
    <div>
      翻訳したい日本語: <input type="text" [(ngModel)]="text" />
    </div>
    <button (click)="onClick()">Translate</button>
    <hr />
    <my-name [text]="translated"></my-name>
  `,
  directives: [Name],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage1 {
  private text: string;
  private clientId: string;
  private clientSecret: string;
  private translated: string;

  constructor(
    private http: Http,
    private cd: ChangeDetectorRef,
    private dispatcher$: Dispatcher<Action>,
    private container: Container
  ) { }
  ngOnInit() {
    this.http.get(path.resolve(appRoot, 'azureDataMarket.secret.json'))
      .map(res => res.json() as Credential)
      .subscribe(credential => {
        this.clientId = credential.ClientId;
        this.clientSecret = credential.ClientSecret;
        this.cd.markForCheck();
        console.log(this.clientId, this.clientSecret);
      });

    this.container.state$
      .map(appState => appState.translated)
      .filter(state => state instanceof Promise)
      .subscribe(state => {
        state.then(translated => {
          this.translated = translated;
          this.cd.markForCheck();
        });
      });
  }

  onClick() {
    this.dispatcher$.next(new NextTranslate(this.text, this.clientId, this.clientSecret, this.http));
  }
}