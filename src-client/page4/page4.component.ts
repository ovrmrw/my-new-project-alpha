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
    <hr />
    <h2>{{title}} - PAGE4</h2>
    <div>{{text}}</div>
    <hr />
    <h2>{{title$ | async}} - PAGE4</h2>
    <div>{{text$ | async}}</div>
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
      // Observableなvalueをプリミティブに変換してViewにPUSHで流し込むやり方。
      this.service.state.text$
        .subscribe(text => this._$text = text), // 普通はsubscribeの中でComponentの変数に値を渡す。

      this.service.state.title$
        .do(title => this._$title = title) // doの中でComponentの変数に値を渡しても良い。但しsubscribeは必要。
        .subscribe(),
    ];
  }

  registerSubscriptionsOnlyOnce() {
    if (!AppPage4Component.isSubscriptionsRegistered) {
      // your subscription code
    }
    AppPage4Component.isSubscriptionsRegistered = true;
  }

  // プリミティブなvalueをView表示時にPULLで取得するやり方。
  get title() { return this.service.state.title; }
  get text() { return this.service.state.text; }

  // ObservableなvalueをAsyncパイプを通してViewにPUSHで流し込むやり方。
  get title$() { return this.service.state.title$; }
  get text$() { return this.service.state.text$; }

  // Observableにより更新される変数なので勝手に変更しないこと。
  private _$title: string;
  private _$text: string;
}