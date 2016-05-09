import { Injectable } from '@angular/core';
import * as types from './types';

@Injectable()
export class Store {
  private states: any[] = [];

  setState(functionOrClass: Function, data: any) {
    let obj = {};
    obj[functionOrClass.name] = data;
    this.states.push(obj);
  }

  getStates(functionOrClass: Function, limit: number): any[] {
    const states = this.states.filter(state => functionOrClass.name in state);
    if (states.length > 0) {
      return states.reverse().slice(0, limit);
    }
    return null;
  }
}