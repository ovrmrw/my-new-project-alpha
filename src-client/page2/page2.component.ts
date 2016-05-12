import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import lodash from 'lodash';
import { AppPage2Service } from './page2.service';

///////////////////////////////////////////////////////////////////////////////////
// Main Component
@Component({
  selector: 'sg-page2',
  template: `
    <h3>{{title}} - PAGE2</h3>
    <div>
      Title: <input type="text" [(ngModel)]="title" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage2Component implements OnInit {
  constructor(
    private service: AppPage2Service,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit() {
    this.service.disposeSubscriptions(); // registerSubscriptionsの前に、登録済みのsubscriptionを全て破棄する。
    this.registerSubscriptions();
  }

  registerSubscriptions() {
    this.service.disposableSubscription = this.service.getTitles$(3)
      .subscribe(titles => {
        console.log('DetectChange: ' + titles[2] + ' -> ' + titles[1] + ' -> ' + titles[0] + ' on Page2');
      });
  }

  set title(title: string) { this.service.setTitle(title); }
  get title() { return this.service.getTitle(); }
}