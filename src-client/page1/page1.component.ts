import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import lodash from 'lodash';

import { AppPage1Service } from './page1.service';
import { appRoot } from '../../src-middle/utils';
import { Credential, Translation } from '../types';
import { ComponentGuidelineUsingStore } from '../store';

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
    <div><ul><li *ngFor="let t of translations">{{t | json}}</li></ul></div>
  `
})
class HistoryComponent {
  @Input() translations: Translation[];
}


///////////////////////////////////////////////////////////////////////////////////
// Main Component
@Component({
  selector: 'sg-page1',
  template: `
    <h2>{{_$title}} - PAGE1</h2>
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
    <hr *ngIf="_$translation" />
    <sg-translation [translation]="_$translation"></sg-translation>
    <hr *ngIf="_$pairs.length > 0" />
    <sg-pairs [pairs]="_$pairs"></sg-pairs>
    <hr />
    <sg-history [translations]="_$translations"></sg-history>
  `,
  directives: [TranslationComponent, PairsComponent, HistoryComponent],
  providers: [AppPage1Service],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage1Component implements OnInit, ComponentGuidelineUsingStore {
  private static isSubscriptionsRegistered: boolean;
  private clientId: string;
  private clientSecret: string;

  constructor(
    private service: AppPage1Service,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit() {
    this.service.disposeSubscriptionsBeforeRegister(); // registerSubscriptionsの前に、登録済みのsubscriptionを全て破棄する。
    this.registerSubscriptionsEveryEntrance(); // ページ遷移入の度にsubscriptionを作成する。
    this.registerSubscriptionsOnlyOnce(); // 最初にページ遷移入したときだけsubscriptionを作成する。
  }

  registerSubscriptionsEveryEntrance() {
    this.service.requestCredential$$(appRoot + 'azureDataMarket.secret.json')
      .subscribe(credential => { // Httpモジュールから流れるストリームをsubscribeしたときは一度nextしたら自動的にcompleteされる。
        this.clientId = credential.ClientId;
        this.clientSecret = credential.ClientSecret;
        this.cd.markForCheck(); // OnPush環境ではWaitが発生する処理を待機するときにはmarkForCheckが必要。
      });

    this.service.disposableSubscription = this.service.getTranslations$$(3)
      .subscribe(translations => {
        console.log('DetectChange: ' + (translations.length > 2 ? translations[2].translated : undefined) + ' -> ' + (translations.length > 1 ? translations[1].translated : undefined) + ' -> ' + (translations.length > 0 ? translations[0].translated : undefined) + ' on Page1');
        this._$translations = translations;
        this.cd.markForCheck(); // OnPush環境ではWaitが発生する処理を待機するときにはmarkForCheckが必要。
      });

    this.service.disposableSubscription = this.service.getPage2Titles$(3)
      .subscribe(titles => {
        console.log('DetectChange: ' + titles[2] + ' -> ' + titles[1] + ' -> ' + titles[0] + ' on Page1');
        this._$title = titles[0];
      });
  }

  registerSubscriptionsOnlyOnce() {
    if (!AppPage1Component.isSubscriptionsRegistered) {
      // your subscription code
    }
    AppPage1Component.isSubscriptionsRegistered = true;
  }

  onClick(event: MouseEvent) {
    this.service.requestTranslation$$(this.text, this.clientId, this.clientSecret)
      .subscribe(translation => { // Httpモジュールから流れるストリームをsubscribeしたときは一度nextしたら自動的にcompleteされる。
        this._$translation = translation;
        this._$pairs.push({ original: translation.text, translated: translation.translated });
        this.cd.markForCheck(); // OnPush環境ではWaitが発生する処理を待機するときにはmarkForCheckが必要。
      });
  }

  set text(text) { this.service.setText(text); }
  get text() { return this.service.getText(); }

  // get title() { return this.service.getTitle(); }

  // Observableにより更新される変数なので勝手に変更しないこと。
  private _$translation: Translation;
  private _$pairs: LangPair[] = [];
  private _$translations: Translation[];
  private _$title: string;
}


///////////////////////////////////////////////////////////////////////////////////
// Local Interfaces
interface LangPair {
  original: string;
  translated: string;
}