import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import lodash from 'lodash';

type ClassOrString = Function | string;

export class AddState {
  constructor(
    public data: any,
    public classOrString: ClassOrString = null
  ) { }
}

@Injectable()
export class Store {
  private states: any[] = [];
  private _dispatcher$: Subject<AddState>;
  private _returner$: Subject<any[]>;

  constructor() {
    this._dispatcher$ = new Subject<AddState>(null);
    this._returner$ = new BehaviorSubject([]);

    this._dispatcher$
      .subscribe(action => {
        this.setState(action.data, action.classOrString);
        this._returner$.next(this.states);
      });
  }

  get dispatcher$() {
    return this._dispatcher$ as Observer<AddState>;
  }

  // get states$() {
  //   // 配列を[]で囲んでfromに入れないと、配列そのものをストリームに流すことができない。
  //   return Observable.from([this.states]) as Observable<any[]>;
  // }

  // 配列としてStatesを取得する。
  getStates<T>(classOrString: ClassOrString, limit: number = 1): T[] {
    const states = this.states.filter(state => {
      if (typeof classOrString === 'string' && classOrString in state) {
        return state;
      } else if (typeof classOrString === 'function' && classOrString.name in state) {
        return state;
      }
    });
    if (states.length > 0) {
      return states.reverse().slice(0, limit) as T[];
    }
    return [];
  }

  getState<T>(classOrString: ClassOrString): T {
    const ary = this.getStates<T>(classOrString);
    return (ary && ary.length > 0 ? ary[0] : null) as T;
  }

  // ObservableとしてStatesを取得する。
  getStates$<T>(classOrString: ClassOrString, limit: number = 1): Observable<T[]> {
    return this._returner$
      .map(states => {
        return states.filter(state => {
          if (typeof classOrString === 'string' && classOrString in state) {
            return state;
          } else if (typeof classOrString === 'function' && classOrString.name in state) {
            return state;
          }
        });
      })
      .map(states => {
        return states.reverse().slice(0, limit) as T[];
      })
      .do(states => {
        console.log('getSates$');
      });
  }

  getState$<T>(classOrString: ClassOrString): Observable<T> {
    return this.getStates$<T>(classOrString)
      .map(states => {
        return (states.length > 0 ? states[0] : null) as T;
      });
  }


  // dataのクラス名をキーとしてStateを登録する。functionOrClassが与えられていればそちらのクラス名を優先して適用する。
  private setState(data: any, classOrString?: ClassOrString) {
    let obj = {};
    let propertyName: string;
    if (typeof classOrString === 'string') {
      propertyName = classOrString;
    } else if (typeof classOrString === 'function') {
      propertyName = classOrString.name;
    } else {
      propertyName = data.constructor.name;
    }
    obj[propertyName] = lodash.cloneDeep(data);
    this.states.push(obj);
    // console.log(this.states);
  }
}