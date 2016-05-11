import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, EventEmitter } from '@angular/core';
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
    <h3>{{_title}} - PAGE2</h3>
    <div>
      Title: <input type="text" [(ngModel)]="title" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage2Component implements OnInit {
  private _title: string;

  constructor(
    private service: AppPage2Service,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit() {
    // this._title = this.service.getTitle(); // ページ遷移入時、StateをViewに戻す。
    this.service.getTitle$().subscribe(title => {
      this._title = title;
      this.cd.markForCheck();
    });
  }

  set title(title: string) {
    this.service.setTitle(title);
  }
  get title() {
    return this.service.getTitle();
  }
}