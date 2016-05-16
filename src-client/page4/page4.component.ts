import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';

import { AppPage4Service } from './page4.service';
import { ComponentGuidelineUsingStore } from '../store';
import { Translation } from '../types';

///////////////////////////////////////////////////////////////////////////////////
// Main Component
@Component({
  selector: 'sg-page4',
  template: `
    <div>ServiceでStateを用意して、Component側の記述をシンプルにする手法。</div>
    <hr />
    <h2>{{_$title}} - PAGE4</h2>
    <div>{{_$text}}</div>
  `,
  providers: [AppPage4Service],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage4Component implements OnInit, ComponentGuidelineUsingStore {
  private static isSubscriptionsRegistered: boolean;

  constructor(
    private service: AppPage4Service,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit() {
    this.service.disposeSubscriptionsBeforeRegister(); // registerSubscriptionsの前に、登録済みのsubscriptionを全て破棄する。
    this.registerSubscriptionsEveryEntrance(); // ページ遷移入の度にsubscriptionを作成する。
    this.registerSubscriptionsOnlyOnce(); // 最初にページ遷移入したときだけsubscriptionを作成する。
  }

  registerSubscriptionsEveryEntrance() {
    this.service.disposableSubscriptions = [
      this.service.state.text$.subscribe(text => this._$text = text),
      this.service.state.title$.subscribe(title => this._$title = title),
    ];
  }

  registerSubscriptionsOnlyOnce() {
    if (!AppPage4Component.isSubscriptionsRegistered) {
      // your subscription code
    }
    AppPage4Component.isSubscriptionsRegistered = true;
  }

  // Observableにより更新される変数なので勝手に変更しないこと。
  private _$title: string;
  private _$text: string;
}