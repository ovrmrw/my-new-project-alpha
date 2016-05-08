import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Http, Request, Response, Headers, RequestOptions } from '@angular/http';
// import path from 'path';

import {Container, Dispatcher} from '../flux/flux-container';
import {Action, NextTranslate} from '../flux/flux-action';
import { appRoot } from '../../src-middle/utils';

///////////////////////////////////////////////////////////////////////////////////
// Helper Components
@Component({
  selector: 'my-name',
  template: `
    <div><h3>{{translation | json}}</h3></div>
  `
})
class Name {
  @Input() translation: Translation;
}

///////////////////////////////////////////////////////////////////////////////////
// Main Component
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
    <my-name [translation]="translationByPush"></my-name>
  `,
  directives: [Name],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage1 {
  private text: string;
  private clientId: string;
  private clientSecret: string;
  private translationByPush: Translation;

  constructor(
    private http: Http,
    private cd: ChangeDetectorRef,
    private dispatcher$: Dispatcher<Action>,
    private container: Container
  ) { }
  ngOnInit() {
    this.http.get(appRoot + 'azureDataMarket.secret.json')
      .map(res => res.json() as Credential)
      .subscribe(credential => {
        this.clientId = credential.ClientId;
        this.clientSecret = credential.ClientSecret;
        this.cd.markForCheck();
      });

    this.container.state$
      .map(appState => appState.translation)
      .filter(state => state instanceof Promise)
      .subscribe(state => {
        state.then(translation => {
          this.translationByPush = translation;
          this.cd.markForCheck();
        });
      });
  }

  onClick() {
    const translation: Translation = {
      text: this.text,
      clientId: this.clientId,
      clientSecret: this.clientSecret
    };
    this.dispatcher$.next(new NextTranslate(translation, this.http));
  }
}