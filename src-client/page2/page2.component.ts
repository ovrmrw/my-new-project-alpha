import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import lodash from 'lodash';

import { AppPage2Service } from './page2.service';
import { ComponentGuidelineUsingStore } from '../app/store.interface';
import { Translation } from '../../src-middle/types';

///////////////////////////////////////////////////////////////////////////////////
// Main Component
@Component({
  selector: 'sg-page2',
  template: `
    <h2>{{title}} - PAGE2</h2>
    <div>
      Title: <input type="text" [(ngModel)]="title" />
    </div>
    <ul><li *ngFor="let t of _$translations">Japanese: {{t.text}} / English: {{t.translated}}</li></ul>
    <hr />
    <button (click)="onClickClearStates($event)">Clear States</button>
  `,
  providers: [AppPage2Service],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage2Component implements OnInit, ComponentGuidelineUsingStore {
  private static isSubscriptionsRegistered: boolean;

  constructor(
    private service: AppPage2Service,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit() {
    this.service.disposeSubscriptionsBeforeRegister(); // registerSubscriptionsの前に、登録済みのsubscriptionを全て破棄する。
    this.registerSubscriptionsEveryEntrance(); // ページ遷移入の度にsubscriptionを作成する。
    this.registerSubscriptionsOnlyOnce(); // 最初にページ遷移入したときだけsubscriptionを作成する。
  }

  registerSubscriptionsEveryEntrance() {
    this.service.disposableSubscription = this.service.getTitles$(3)
      .subscribe(titles => {
        console.log('DetectChange: ' + titles[2] + ' -> ' + titles[1] + ' -> ' + titles[0] + ' on Page2');
      });

    this.service.disposableSubscription = this.service.getTranslations$(10)
      .subscribe(translations => {
        console.log('DetectChange: ' + (translations.length > 2 ? translations[2].translated : undefined) + ' -> ' + (translations.length > 1 ? translations[1].translated : undefined) + ' -> ' + (translations.length > 0 ? translations[0].translated : undefined) + ' on Page2');
        this._$translations = translations;
        this.cd.markForCheck(); // OnPush環境ではWaitが発生する処理を待機するときにはmarkForCheckが必要。
      });
  }

  registerSubscriptionsOnlyOnce() {
    if (!AppPage2Component.isSubscriptionsRegistered) {
      // your subscription code
    }
    AppPage2Component.isSubscriptionsRegistered = true;
  }

  set title(title: string) { this.service.setTitle(title); }
  get title() { return this.service.getTitle(); }

  onClickClearStates() {
    this.service.clearStatesAndLocalStorage();
  }

  // get translations() { return this.service.getTranslations(3); }

  // Observableにより更新される変数なので勝手に変更しないこと。
  private _$translations: Translation[];
}