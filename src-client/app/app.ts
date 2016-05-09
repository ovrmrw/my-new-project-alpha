import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, Route, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
// import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {Location} from '@angular/common';
import {AppPage1Component} from '../page1/page1.component';

///////////////////////////////////////////////////////////////////////////////////
// Top Component
@Component({
  selector: 'sg-app',
  template: `
    <nav>
      <ul>
        <li><a [routerLink]="['/Page1']">Page1</a></li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `,
  directives: [AppPage1Component, ROUTER_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.Default
})
@RouteConfig([
  new Route({ path: 'p1', component: AppPage1Component, name: 'Page1', useAsDefault: true }),
])
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }
  ngOnInit() { }
}