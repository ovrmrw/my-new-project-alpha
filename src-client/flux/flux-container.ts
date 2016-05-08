import { bind } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/debounceTime';
const falcor = require('falcor');

import {Action} from './flux-action';
import * as reducers from './flux-container.reducer';

/////////////////////////////////////////////////////////////////////////////
// Container(Storeのようなもの)
export class Container {
  private stateSubject$: Subject<AppState>;
  // private falcorModel: any;

  constructor(initState: AppState, dispatcher$: Observable<Action>) {
    this.stateSubject$ = new BehaviorSubject(initState);
    // this.falcorModel = new falcor.Model({ source: new falcor.HttpDataSource('/model.json') });

    Observable
      .zip<AppState>(
        reducers.translationStateReducer(initState.translation, dispatcher$),
        (translation) => {
          return {
            translation: translation
          } as AppState
        }
      )
      .debounceTime(1)
      .subscribe(appState => {
        this.stateSubject$.next(appState); // Componentでこのnextを受ける。
        // console.log(appState);
      });
  }

  get state$() {
    return this.stateSubject$ as Observable<AppState>;
  }
}


/////////////////////////////////////////////////////////////////////////////
// DI
export class Dispatcher<T> extends Subject<T> {
  constructor(destination?: Observer<T>, source?: Observable<T>) {
    super(destination, source);
  }
}

const initState: AppState = {
  translation: null
}

export const stateAndDispatcher = [
  bind('initState').toValue(initState),
  bind(Dispatcher).toValue(new Dispatcher<Action>(null)),
  bind(Container).toFactory((state, dispatcher) => new Container(state, dispatcher), ['initState', Dispatcher])
];
