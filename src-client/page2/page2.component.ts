import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import lodash from 'lodash';
import { AppPage2Service } from './page2.service';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/do';
import { ComponentGuidelineUsingStore } from '../app/store.interface';

///////////////////////////////////////////////////////////////////////////////////
// Main Component
@Component({
  selector: 'sg-page2',
  template: `
    <h3>{{title}} - PAGE2</h3>
    <div>
      Title: <input type="text" [(ngModel)]="title" />
    </div>
    <ul><li *ngFor="let t of translations">{{t | json}}</li></ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage2Component implements OnInit, ComponentGuidelineUsingStore {
  private static isSubscriptionsRegistered: boolean;

  constructor(
    private service: AppPage2Service,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit() {
    // this.service.disposeSubscriptions(); // registerSubscriptionsの前に、登録済みのsubscriptionを全て破棄する。
    this.registerSubscriptionsEverytime(); // ページ遷移入の度にsubscriptionを作成する。
    this.registerSubscriptionsOnlyOnce(); // 最初にページ遷移入したときだけsubscriptionを作成する。
  }

  registerSubscriptionsEverytime() { }

  registerSubscriptionsOnlyOnce() {
    if (!AppPage2Component.isSubscriptionsRegistered) {
      // this.service.disposableSubscription = this.service.getTitles$(3)
      this.service.getTitles$(3)
        .subscribe(titles => {
          console.log('DetectChange: ' + titles[2] + ' -> ' + titles[1] + ' -> ' + titles[0] + ' on Page2');
        });
    }
    AppPage2Component.isSubscriptionsRegistered = true;
  }

  set title(title: string) { this.service.setTitle(title); }
  get title() { return this.service.getTitle(); }

  get translations() { return this.service.getTranslations(3); }
}