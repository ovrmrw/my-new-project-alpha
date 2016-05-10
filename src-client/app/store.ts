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

class AddState {
  constructor(
    public data: any,
    public propertyName: string
  ) { }
}

@Injectable()
export class Store {
  private states: any[] = [];
  private _dispatcher$: Subject<any>;
  private _returner$: Subject<any[]>;

  constructor() {
    this._dispatcher$ = new Subject<AddState>(null);
    this._returner$ = new BehaviorSubject([]);

    this._dispatcher$
      .subscribe(newState => {
        this.states.push(newState);
        console.log(this.states);
        this._returner$.next(this.states);
      });
  }

  // get dispatcher$() {
  //   return this._dispatcher$ as Observer<AddState>;
  // }

  // get states$() {
  //   // 配列を[]で囲んでfromに入れないと、配列そのものをストリームに流すことができない。
  //   return Observable.from([this.states]) as Observable<any[]>;
  // }

  // 配列としてStatesを取得する。
  getStates<T>(limit: number, classOrString: ClassOrString, ...prefixes: (ClassOrString | Object)[]): T[] {
    const propertyName = mergeName(null, classOrString, ...prefixes);
    const states = this.states.filter(state => {
      if (propertyName in state) {
        return state;
      }
      // if (typeof classOrString === 'string' && classOrString in state) {
      //   return state;
      // } else if (typeof classOrString === 'function' && classOrString.name in state) {
      //   return state;
      // }
    });
    if (states.length > 0) {
      const _limit = limit && limit > 0 ? limit : 1;
      return states.reverse().slice(0, _limit) as T[];
    }
    return [];
  }

  getState<T>(classOrString: ClassOrString, ...prefixes: (ClassOrString | Object)[]): T {
    const ary = this.getStates<T>(1, classOrString, ...prefixes);
    return (ary && ary.length > 0 ? ary[0] : null) as T;
  }

  // ObservableとしてStatesを取得する。
  getStates$<T>(limit: number, classOrString: ClassOrString, ...prefixes: (ClassOrString | Object)[]): Observable<T[]> {
    const propertyName = mergeName(null, classOrString, ...prefixes);
    return this._returner$
      .map(states => {
        return states.filter(state => {
          if (propertyName in state) {
            return state;
          }
        });
      })
      .map(states => {
        const _limit = limit && limit > 0 ? limit : 1;
        return states.reverse().slice(0, _limit) as T[];
      })
      .do(states => {
        console.log('getSates$');
      });
  }

  getState$<T>(classOrString: ClassOrString, ...prefixes: (ClassOrString | Object)[]): Observable<T> {
    return this.getStates$<T>(1, classOrString, ...prefixes)
      .map(states => {
        return (states.length > 0 ? states[0] : null) as T;
      });
  }


  // dataのクラス名をキーとしてStateを登録する。functionOrClassが与えられていればそちらのクラス名を優先して適用する。
  setState(data: any, classOrString?: ClassOrString, ...prefixes: (ClassOrString | Object)[]) {
    console.log('setState');
    console.log(this.constructor.name);
    const propertyName = mergeName(data, classOrString, ...prefixes);
    // if (typeof classOrString === 'string') {
    //   propertyName = classOrString;
    // } else if (typeof classOrString === 'function') {
    //   propertyName = classOrString.name;
    // } else {
    //   propertyName = data.constructor.name;
    // }
    let obj = {};
    obj[propertyName] = lodash.cloneDeep(data);
    this._dispatcher$.next(obj);
  }
}


// data, classOrString, prefixesの全てを合成してプロパティ名を生成する。
function mergeName(data?: any, classOrString?: ClassOrString, ...prefixes: (ClassOrString | Object)[]): string {
  let propertyName: string = '';

  if (typeof classOrString === 'string') {
    propertyName += classOrString;
  } else if (typeof classOrString === 'function') {
    propertyName += classOrString.name;
  } else if (typeof classOrString === 'object') {
    propertyName += classOrString.constructor.name;
  } else {
    propertyName += data.constructor.name;
  }

  if (prefixes.length > 0) {
    const ary = prefixes.map(prefix => {
      if (typeof prefix === 'string') {
        return prefix;
      } else if (typeof prefix === 'function') {
        return prefix['name'];
      } else {
        return prefix.constructor.name;
      }
    });
    propertyName = ary.concat(propertyName).join('-');
  }
  return propertyName;
}
