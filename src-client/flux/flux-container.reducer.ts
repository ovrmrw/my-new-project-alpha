import {Observable} from 'rxjs/Observable';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/toPromise';

import {Action} from './flux-action';
import * as actions from './flux-action';

/////////////////////////////////////////////////////////////////////////////
// Reducers
export function translationStateReducer(initState: any, dispatcher$: Observable<Action>): Observable<Promise<Translation>> {
  return dispatcher$.scan((state: Promise<Translation>, action: Action) => {
    if (action instanceof actions.NextTranslate) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = JSON.stringify(action.translation);
      return action.http.post('/translation', body, { headers: headers })
        .map(res => res.json() as Translation)
        .toPromise();
    } else {
      return state;
    }
  }, initState);
}
