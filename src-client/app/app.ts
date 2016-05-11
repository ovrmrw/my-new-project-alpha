import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, Route, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
// import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {Location} from '@angular/common';
import {AppPage1Component} from '../page1/page1.component';
import {AppPage2Component} from '../page2/page2.component';
import { AppPage1Service } from '../page1/page1.service';
import { AppPage2Service } from '../page2/page2.service';
import { Store } from './store';

///////////////////////////////////////////////////////////////////////////////////
// Top Component
@Component({
  selector: 'sg-app',
  template: `
    <nav>
      <ul>
        <li><a [routerLink]="['/Page1']">Page1</a></li>
        <li><a [routerLink]="['/Page2']">Page2</a></li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [Store, AppPage1Service, AppPage2Service],
  // changeDetection: ChangeDetectionStrategy.Default
})
@RouteConfig([
  new Route({ path: 'p1', component: AppPage1Component, name: 'Page1', useAsDefault: true }),
  new Route({ path: 'p2', component: AppPage2Component, name: 'Page2' }),
])
export class AppComponent { }