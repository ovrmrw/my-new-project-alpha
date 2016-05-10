/////////////////////////////////////////////////////////////////////////////
// Entry Point

import {provide, enableProdMode} from '@angular/core';
// import {ROUTER_PROVIDERS} from '@angular/router';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { HTTP_PROVIDERS } from '@angular/http';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './app/app';
// import {stateAndDispatcher} from './flux/flux-container';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/debounceTime';

enableProdMode();
bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  // stateAndDispatcher
]);