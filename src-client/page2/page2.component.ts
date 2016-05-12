import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import lodash from 'lodash';
// import {Container, Dispatcher} from '../flux/flux-container';
// import {Action, NextTranslate} from '../flux/flux-action';
import { AppPage2Service } from './page2.service';
import { appRoot } from '../../src-middle/utils';
import { Credential, Translation } from '../../src-middle/types';

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
  private static afterRegister: boolean;

  constructor(
    private service: AppPage2Service,
    private cd: ChangeDetectorRef
  ) {
    this.service.disposeSubscriptions(); // ngOnInit前に、登録済みのsubscriptionを全て破棄する。
  }
  ngOnInit() {
    this.service.disposableSubscription = this.service.getTitles$(3)
      .subscribe(titles => {
        console.log('DetectChange: ' + titles[2] + ' -> ' + titles[1] + ' -> ' + titles[0] + ' on Page2');
      });
  }

  set title(title: string) { this.service.setTitle(title); }
  get title() { return this.service.getTitle(); }
}