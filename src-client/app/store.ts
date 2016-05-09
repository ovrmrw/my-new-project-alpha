import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AddState } from './types';
import 'rxjs/add/observable/from';

@Injectable()
export class Store {
  private states: any[] = [];
  private _dispatcher$ = new Subject(null);

  constructor() {
    this._dispatcher$
      .subscribe((action: AddState) => {
        this.setState(action.data, action.functionOrClass);
      });
  }

  // dataのクラス名をキーとしてStateを登録する。functionOrClassが与えられていればそちらのクラス名を優先して適用する。
  private setState(data: any, functionOrClass?: Function) {
    let obj = {};
    let propertyName = functionOrClass ? functionOrClass.name : data.constructor.name;
    obj[propertyName] = data;
    this.states.push(obj);
    console.log(this.states);
  }

  getStates<T>(functionOrClass: string, limite?: number): T[];
  getStates<T>(functionOrClass: T, limit?: number): T[];
  getStates<T>(functionOrClass: any, limit?: number): T[] {
    const states = this.states.filter(state => {
      if (typeof functionOrClass === 'string' && functionOrClass in state) {
        return state;
      } else if (functionOrClass.name in state) {
        return state;
      }
    });
    if (states.length > 0) {
      let _limit = limit || 100;
      return states.reverse().slice(0, _limit);
    }
    return null;
  }

  get dispatcher$() {
    return this._dispatcher$ as Observer<any>;
  }
  
  get state$(){
    return Observable.from(this.states) as Observable<any[]>;
  }
}