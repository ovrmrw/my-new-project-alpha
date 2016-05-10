import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/from';
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
  private _dispatcher$ = new Subject<AddState>(null);
  private _returner$ = new Subject<any[]>(null);

  constructor() {
    this._dispatcher$
      .subscribe((action: AddState) => {
        this.setState(action.data, action.classOrString);
        this._returner$.next(this.states);
      });
  }

  get dispatcher$() {
    return this._dispatcher$ as Observer<AddState>;
  }

  get states$() {
    return Observable.from(this.states) as Observable<any[]>;
  }

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
    return null;
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
      .do(states => {
        console.log('getSates$');
        console.log(states);
      })
      .map(states => {
        // let ary = states.reverse().slice(0, limit);
        // if (ary.length === 0) {
        //   return [null];
        // } else {
          return states.reverse().slice(0, limit) as T[];
        // }
      });
    // const states = this.getStates(classOrString, limit) || [];

    // console.log(states);
    // return Observable.from([states]) as Observable<T[]>; // 配列を[]で囲んで渡さないと配列そのものをストリームに流すことはできない。
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