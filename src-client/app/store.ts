import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';
import lodash from 'lodash';

type Nameable = Function | Object | string;

@Injectable()
export class Store {
  private states: { string?: any }[] = [];
  private subscriptions: { string?: Subscription }[] = [];
  private _dispatcher$: Subject<any>;
  private _returner$: Subject<{ string?: any }[]>;

  constructor() {
    this._dispatcher$ = new Subject<any>(null);
    this._returner$ = new BehaviorSubject([]);

    this._dispatcher$
      // .debounceTime(100) // ここにdebounceTimeを入れると全てmarkForCheckが必要になる。Viewまで含めて途端に扱いが難しくなる。
      .subscribe(newState => {
        this.states.push(newState);
        this.states = gabageCollector(this.states);
        console.log('↓ states array on Store ↓');
        console.log(this.states);
        this._returner$.next(this.states);
      });
  }

  setState(data: any, nameablesAsIdentifier: Nameable[]): void {
    const identifier = generateIdentifier(nameablesAsIdentifier);
    let obj = {};
    obj[identifier] = lodash.cloneDeep(data);
    this._dispatcher$.next(obj);
  }

  getStates<T>(limit: number, nameablesAsIdentifier: Nameable[]): T[] {
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
    const ary = this.getStates<T>(1, nameablesAsIdentifier);
    const state = ary && ary.length > 0 ? ary[0] : null;
    return state;
  }

  getStates$<T>(limit: number, nameablesAsIdentifier: Nameable[]): Observable<T[]> {
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
    return this.getStates$<T>(1, nameablesAsIdentifier)
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
}

// TODO: Implement
function gabageCollector(array: any[]) {
  return array;
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
      p.push('$');
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