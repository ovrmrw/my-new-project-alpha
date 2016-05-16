import { Injectable } from '@angular/core';
// import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/observable/from';
// import 'rxjs/add/operator/do';
import lodash from 'lodash';

type Nameable = Function | Object | string;
type StateObject = { string?: any };
type SubscriptionObject = { string?: Subscription };

const LOCAL_STORAGE_KEY = 'ovrmrw-localstorage-store';
const MAX = 1000;

@Injectable()
export class Store {
  private states: StateObject[];
  private subscriptions: SubscriptionObject[] = [];
  private _dispatcher$: Subject<any> = new Subject<any>(null);
  private _localStorageKeeper$: Subject<StateObject[]> = new Subject<StateObject[]>(null);
  private _returner$: BehaviorSubject<StateObject[]>;

  constructor() {
    let ls: any = null;
    try {
      console.time('localStorageGetItem');
      ls = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      console.timeEnd('localStorageGetItem');
    } catch (err) {
      console.error(err);
    }
    this.states = ls ? JSON.parse(ls) : [];
    this._returner$ = new BehaviorSubject(this.states);

    this._dispatcher$
      // .debounceTime(100) // ここにdebounceTimeを入れると全てmarkForCheckが必要になる。Viewまで含めて途端に扱いが難しくなる。
      .subscribe(newState => {
        this.states.push(newState);
        // this.states = gabageCollector(this.states);
        this.states = gabageCollectorFastTuned(this.states);
        // console.log('↓ states array on Store ↓');
        // console.log(this.states);
        this._returner$.next(this.states);
        this._localStorageKeeper$.next(this.states);
      });

    // debounceTimeで頻度を抑えながらLocalStorageに保存する。
    this._localStorageKeeper$
      .debounceTime(250)
      .subscribe(stateObjects => {
        try {
          console.time('localStorageSetItem');
          window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateObjects));
          console.timeEnd('localStorageSetItem');
          // console.log('localStorageに保存');
        } catch (err) {
          console.error(err);
        }
      });
  }

  setState(data: any, nameablesAsIdentifier: Nameable[]): void {
    const identifier = generateIdentifier(nameablesAsIdentifier);
    let obj = {};
    obj[identifier] = lodash.cloneDeep(data);
    this._dispatcher$.next(obj);
  }

  getStates<T>(nameablesAsIdentifier: Nameable[], limit: number = MAX): T[] {
    const identifier = generateIdentifier(nameablesAsIdentifier);
    const states = this.states
      .filter(obj => obj && identifier in obj)
      .map(obj => pickValueFromObject(obj));
    if (states.length > 0) {
      const _limit = limit && limit > 0 ? limit : 1;
      return states.reverse().slice(0, _limit) as T[];
    } else {
      return [] as T[];
    }
  }

  getState<T>(nameablesAsIdentifier: Nameable[]): T {
    const ary = this.getStates<T>(nameablesAsIdentifier, 1);
    const state = ary && ary.length > 0 ? ary[0] : null;
    return state;
  }

  getStates$<T>(nameablesAsIdentifier: Nameable[], limit: number = MAX): Observable<T[]> {
    const identifier = generateIdentifier(nameablesAsIdentifier);
    return this._returner$
      .map(objs => {
        return objs.filter(obj => obj && identifier in obj);
      })
      .map(objs => {
        return objs.map(obj => pickValueFromObject(obj));
      })
      .map(states => {
        const _limit = limit && limit > 0 ? limit : 1;
        return states.reverse().slice(0, _limit) as T[];
      });
  }

  getState$<T>(nameablesAsIdentifier: Nameable[]): Observable<T> {
    return this.getStates$<T>(nameablesAsIdentifier, 1)
      .map(states => {
        return (states.length > 0 ? states[0] : null);
      });
  }

  setDisposableSubscription(subscription: Subscription, nameablesAsIdentifier: Nameable[]): void {
    const identifier = generateIdentifier(nameablesAsIdentifier);
    let obj = {};
    obj[identifier] = subscription;
    this.subscriptions.push(obj);
  }

  disposeSubscriptions(nameablesAsIdentifier: Nameable[] = [this]): void {
    const identifier = generateIdentifier(nameablesAsIdentifier);
    this.subscriptions
      .filter(obj => obj && identifier in obj)
      .map(obj => pickValueFromObject(obj))
      .forEach(subscription => {
        subscription.unsubscribe();
      });
    const aliveSubscriptions = this.subscriptions
      .filter(obj => {
        const subscription = pickValueFromObject(obj);
        if (subscription && !subscription.isUnsubscribed) {
          return true;
        }
      });
    this.subscriptions = null;
    this.subscriptions = aliveSubscriptions;
    console.log('↓ subscriptions array on Store ↓');
    console.log(this.subscriptions);
  }

  clearStatesAndLocalStorage(): void {
    try {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
    this.states = null;
    this.states = [];
    this._dispatcher$.next(null);
  }
}


function gabageCollector(stateObjects: StateObject[], maxElementsByKey: number = MAX) {
  console.time('gabageCollector');
  const keys = stateObjects.filter(obj => obj && typeof obj === 'object').map(obj => Object.keys(obj)[0]);
  const uniqKeys = lodash.uniq(keys);
  // console.log('Keys: ' + uniqKeys.join(', '));
  let newObjs: StateObject[] = [];

  // key毎に保存最大数を超えたものをカットして新しい配列を作る。
  uniqKeys.forEach(key => {
    const objs = stateObjects.filter(obj => obj && key in obj);
    if (objs.length > maxElementsByKey) {
      objs.reverse().slice(0, maxElementsByKey).reverse().forEach(obj => newObjs.push(obj));
    } else {
      objs.forEach(obj => newObjs.push(obj));
    }
  });
  console.timeEnd('gabageCollector');
  return newObjs;
}

// gabageCollectorの処理速度が高速になるようにチューニングしたもの。10倍近く速い。
// 参考: http://qiita.com/keroxp/items/67804391a8d65eb32cb8
function gabageCollectorFastTuned(stateObjects: StateObject[], maxElementsByKey: number = MAX) {
  // 最速0.38 ms
  console.time('gabageCollectorFastTuned');
  // const keys = stateObjects.filter(obj => obj && typeof obj === 'object').map(obj => Object.keys(obj)[0]);
  let keys: string[] = [];
  // let i = 0;
  for (let i = 0; i < stateObjects.length; i = (i + 1) | 0) {
    if (typeof stateObjects[i] === 'object') {
      keys.push(Object.keys(stateObjects[i])[0]);
    }
    // i = (i + 1) | 0;
  }
  const uniqKeys = lodash.uniq(keys);
  // console.log('Keys: ' + uniqKeys.join(', '));
  let newObjs: StateObject[] = [];

  // key毎に保存最大数を超えたものをカットして新しい配列を作る。
  // uniqKeys.forEach(key => {
  //   const objs = stateObjects.filter(obj => obj && key in obj);
  //   if (objs.length > maxElementsByKey) {
  //     objs.reverse().slice(0, maxElementsByKey).reverse().forEach(obj => newObjs.push(obj));
  //   } else {
  //     objs.forEach(obj => newObjs.push(obj));
  //   }
  // });
  // let j = 0;
  for (let j = 0; j < uniqKeys.length; j = (j + 1) | 0) {
    // const objs = stateObjects.filter(obj => obj && uniqKeys[i] in obj);
    let objs: StateObject[] = [];
    // let k = 0;
    for (let k = 0; k < stateObjects.length; k = (k + 1) | 0) {
      if (uniqKeys[j] in stateObjects[k]) {
        objs.push(stateObjects[k]);
      }
      // k = (k + 1) | 0;
    }
    if (objs.length > maxElementsByKey) {
      // objs.reverse().slice(0, maxElementsByKey).reverse().forEach(obj => newObjs.push(obj));
      const ary = objs.reverse().slice(0, maxElementsByKey).reverse(); // TODO:もっとやりようがある。
      // let l = 0;
      for (let l = 0; l < ary.length; l = (l + 1) | 0) {
        newObjs.push(ary[l]);
        // l = (l + 1) | 0;
      }
    } else {
      // objs.forEach(obj => newObjs.push(obj));
      // let l = 0;
      for (let l = 0; l < objs.length; l = (l + 1) | 0) {
        newObjs.push(objs[l]);
        // l = (l + 1) | 0;
      }
    }
    // j = (j + 1) | 0;
  }
  console.timeEnd('gabageCollectorFastTuned');
  return newObjs;
}

function generateIdentifier(nameables: Nameable[]): string {
  let ary: string[] = [];

  nameables.reduce((p: string[], nameable) => {
    if (nameable && typeof nameable === 'string') {
      p.push(nameable);
    } else if (nameable && typeof nameable === 'function') {
      p.push(nameable.name);
    } else if (nameable && typeof nameable === 'object') {
      p.push(nameable.constructor.name);
    } else {
      p.push('###');
    }
    return p;
  }, ary);

  return ary.join('_');
}

function pickValueFromObject<T>(obj: { string?: T }): T {
  try {
    return lodash.values(obj)[0] as T;
  } catch (err) {
    // return obj as T;
  }
}