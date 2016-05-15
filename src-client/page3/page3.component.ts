import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import lodash from 'lodash';

import { ComponentGuidelineUsingStore } from '../store';
import { Translation } from '../../src-middle/types';
import { AppPage3Service } from './page3.service';

///////////////////////////////////////////////////////////////////////////////////
// Main Component
@Component({
  selector: 'sg-page3',
  template: `
    <h2>{{title}} - PAGE3</h2>
    <h3>Changing history of Title</h3>
    <div>
      {{_$title}}
    </div>
  `,
  providers: [AppPage3Service],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage3Component implements OnInit, ComponentGuidelineUsingStore {
  private static isSubscriptionsRegistered: boolean;

  constructor(
    private service: AppPage3Service,
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
        console.log('DetectChange: ' + titles[2] + ' -> ' + titles[1] + ' -> ' + titles[0] + ' on Page3');
      });

    const titles = this.service.getTitles().reverse();
    const intervalSubscription = Observable.interval(10)
      .subscribe(x => {
        if (titles.length > x) {
          console.log(titles[x]);
          this._$title = titles[x];
          this.cd.markForCheck();
        } else {
          intervalSubscription.unsubscribe(); // これ以上監視する必要がないのでunsubscribeする。
        }
      });
    this.service.disposableSubscription = intervalSubscription;
  }

  registerSubscriptionsOnlyOnce() {
    if (!AppPage3Component.isSubscriptionsRegistered) {
      // your subscription code
    }
    AppPage3Component.isSubscriptionsRegistered = true;
  }

  get title() { return this.service.getTitle(); }

  // Observableにより更新される変数なので勝手に変更しないこと。;
  private _$title: string;
}