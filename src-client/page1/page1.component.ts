import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, EventEmitter } from '@angular/core';
import lodash from 'lodash';
// import {Container, Dispatcher} from '../flux/flux-container';
// import {Action, NextTranslate} from '../flux/flux-action';
import { AppPage1Service } from './page1.service';
import { appRoot } from '../../src-middle/utils';
import { Credential, Translation } from '../../src-middle/types';

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

@Component({
  selector: 'sg-history',
  template: `
    <div><ul><li *ngFor="let h of history">{{h | json}}</li></ul></div>
  `
})
class HistoryComponent {
  @Input() history: Translation[];
}


///////////////////////////////////////////////////////////////////////////////////
// Main Component
@Component({
  selector: 'sg-page1',
  template: `
    <h3>{{title}} - PAGE1</h3>
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
    <button (click)="onClick($event)">Translate</button>
    <hr *ngIf="translationByPush" />
    <sg-translation [translation]="translationByPush"></sg-translation>
    <hr *ngIf="pairsByPush.length > 0" />
    <sg-pairs [pairs]="pairsByPush"></sg-pairs>
    <hr />
    <sg-history [history]="historyByPush"></sg-history>
    <div>HISTORY2: {{history2 | json}}</div>
  `,
  directives: [TranslationComponent, PairsComponent, HistoryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage1Component implements OnInit {
  // private text: string;
  private clientId: string;
  private clientSecret: string;

  constructor(
    private service: AppPage1Service,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit() {
    this.service.requestCredential$(appRoot + 'azureDataMarket.secret.json')
      .subscribe(credential => {
        this.clientId = credential.ClientId;
        this.clientSecret = credential.ClientSecret;
        this.cd.markForCheck();
        console.log('getCredential$');
      });

    this.service.getTranslations$()
      .subscribe(history => this.historyByPush = history);

    // this.service.getTitle$()
    //   .subscribe(title => this.titleByPush = title);
  }

  onClick(event: MouseEvent) {
    // this.dispatcher$.next(new NextTranslate(translation, this.http));
    this.service.requestTranslation$(this.text, this.clientId, this.clientSecret)
      .subscribe(translation => {
        this.translationByPush = translation;
        this.pairsByPush.push({ original: translation.text, translated: translation.translated });
        this.cd.markForCheck();
        console.log('getTranslation$');
      });
  }

  set text(text) { this.service.setText(text); }
  get text() { return this.service.getText(); }

  get title() { return this.service.getTitle(); }

  // get history() {
  //   // this.service.getHistory$(3).subscribe(states => console.log(states));
  //   return this.service.getTranslationHistory$(3).do(states => {
  //     console.log('get history');
  //     console.log(states);
  //     // this.cd.markForCheck();      
  //   });
  //   // return thiranslationHistory$(3).map(states => states);
  // }
  get history2() { return this.service.getTranslations(); }


  // Observableにより更新される変数なので勝手に変更しないこと。
  private translationByPush: Translation;
  private pairsByPush: LangPair[] = [];
  private historyByPush: Translation[];
  // private titleByPush: string;
}


///////////////////////////////////////////////////////////////////////////////////
// Local Interfaces
interface LangPair {
  original: string;
  translated: string;
}