import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import lodash from 'lodash';
// import {Container, Dispatcher} from '../flux/flux-container';
// import {Action, NextTranslate} from '../flux/flux-action';
import { AppPage1Service } from './page1.service';
import { appRoot } from '../../src-middle/utils';
import * as types from '../app/types';

///////////////////////////////////////////////////////////////////////////////////
// Helper Components
@Component({
  selector: 'sg-translation',
  template: `
    <div>{{translation | json}}</div>
  `
})
class TranslationComponent {
  @Input() translation: Translation;
}

@Component({
  selector: 'sg-pairs',
  template: `
    <div><ul><li *ngFor="let pair of reversedPairs">{{pair.original}} -> {{pair.translated}}</li></ul></div>
  `
})
class PairsComponent {
  @Input() pairs: LangPair[];

  get reversedPairs() {
    return lodash.cloneDeep(this.pairs).reverse();
  }
}


///////////////////////////////////////////////////////////////////////////////////
// Main Component
@Component({
  selector: 'sg-page1',
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
    <hr *ngIf="translationByPush" />
    <sg-translation [translation]="translationByPush"></sg-translation>
    <hr *ngIf="pairsByPush.length > 0" />
    <sg-pairs [pairs]="pairsByPush"></sg-pairs>
    <hr />
    <button (click)="getHistory()">History</button>
  `,
  directives: [TranslationComponent, PairsComponent],
  providers: [AppPage1Service],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage1Component implements OnInit {
  private text: string;
  private clientId: string;
  private clientSecret: string;
  private translationByPush: Translation;
  private pairsByPush: LangPair[] = [];

  constructor(
    private service: AppPage1Service,
    private cd: ChangeDetectorRef
    // private dispatcher$: Dispatcher<Action>,
    // private container: Container,
  ) { }
  ngOnInit() {
    this.service.getCredential(appRoot + 'azureDataMarket.secret.json')
      .then(credential => {
        this.clientId = credential.ClientId;
        this.clientSecret = credential.ClientSecret;
        this.cd.markForCheck();
      });

    // this.container.state$
    //   .map(appState => appState.translation)
    //   .filter(state => state instanceof Promise)
    //   .subscribe(state => {
    //     state.then(translation => {
    //       this.translationByPush = translation;
    //       this.cd.markForCheck();
    //     });
    //   });
  }

  onClick() {
    const translation: Translation = {
      text: this.text,
      clientId: this.clientId,
      clientSecret: this.clientSecret
    };
    // this.dispatcher$.next(new NextTranslate(translation, this.http));
    this.service.getTranslation(translation)
      .then(translation => {
        this.translationByPush = translation;
        this.pairsByPush.push({ original: translation.text, translated: translation.translated });
        this.cd.markForCheck();
      });
  }

  getHistory() {
    console.log(this.service.getHistory(3));
  }
}


///////////////////////////////////////////////////////////////////////////////////
// Local Interfaces
interface LangPair {
  original: string;
  translated: string;
}