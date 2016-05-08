import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, Route, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
// import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {Location} from '@angular/common';
import {AppPage1} from '../page1/page1.component';

///////////////////////////////////////////////////////////////////////////////////
// Top Component
@Component({
  selector: 'my-app',
  template: `
    <nav>
      <ul>
        <li><a [routerLink]="['/Page1']">Page1</a></li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `,
  directives: [AppPage1, ROUTER_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.Default
})
@RouteConfig([
  new Route({ path: 'p1', component: AppPage1, name: 'Page1', useAsDefault: true }),
])
export class App implements OnInit {
  constructor(
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit() { }
}