import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ComponentGuidelineUsingStore } from '../store';
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
    <h3>Changing history of Text</h3>
    <div>
      {{_$text}}
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
    const titleSubscription = this.service.getTitles$(3)
      .subscribe(titles => {
        console.log('DetectChange: ' + titles[2] + ' -> ' + titles[1] + ' -> ' + titles[0] + ' on Page3');
      });

    const titles = this.service.getTitles().reverse();
    const texts = this.service.getTexts().reverse();
    const intervalSubscription = Observable.interval(5)
      .subscribe(x => {
        if (titles.length > x) {
          console.log(titles[x]);
          this._$title = titles[x];
        }

        if (texts.length > x) {
          console.log(texts[x]);
          this._$text = texts[x];
        }

        if (titles.length > x || texts.length > x) {
          this.cd.markForCheck(); // OnPush環境ではWaitが発生する処理を待機するときにはmarkForCheckが必要。
        } else {
          intervalSubscription.unsubscribe(); // これ以上監視する必要がないのでunsubscribeする。
        }
      });

    this.service.disposableSubscriptions = [titleSubscription, intervalSubscription];
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
  private _$text: string;
}