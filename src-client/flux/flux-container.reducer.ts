import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/toPromise';
import {Action} from './flux-action';
import {NextNow,
  NextTranslate,
  NextMessageFromFalcorPage1,
  NextMessageFromFalcorPage2,
  NextDocumentsFromFalcorPage3,
  NextDocumentsFromFalcorPage4} from './flux-action';

import { Headers } from '@angular/http';

export function translateStateReducer(initState: any, dispatcher$: Observable<Action>): Observable<Promise<string>> {
  return dispatcher$.scan((state: Promise<string>, action: Action) => {
    if (action instanceof NextTranslate) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = JSON.stringify({
        text: action.text,
        clientId: action.clientId,
        clientSecret: action.clientSecret
      });
      return action.http.post(null, null, {
        url: '/trans',
        body: body,
        headers: headers
      })
        .map(res => {
          console.log(res.json());
          return res.json().result;
        })
        .toPromise();
    } else {
      return null;
    }
  }, initState);

}
// import { getValueFromJsonGraph, getArrayFromJsonGraph } from '../app/falcor-utils';

// // 現在日時を更新するReducer。
// export function nowStateReducer(initState: number, dispatcher$: Observable<Action>): Observable<number> {
//   return dispatcher$.scan((datetime: number, action: Action) => {
//     if (action instanceof NextNow) {
//       return action.datetime;
//     } else {
//       return datetime;
//     }
//   }, initState);
// }

// // Falcorを通してデータを取得するReducer。戻り値がObservable<Promise<any>>になるのが特徴。
// export function stateReducerPage1(initState: any, dispatcher$: Observable<Action>, falcorModel: any): Observable<Promise<StatePage1>> {
//   return dispatcher$.scan((state: Promise<StatePage1>, action: Action) => {
//     if (action instanceof NextMessageFromFalcorPage1) {
//       return new Promise<StatePage1>(resolve => {
//         falcorModel
//           .get(action.falcorQuery)
//           .then(jsonGraph => {
//             // console.log(JSON.stringify(jsonGraph, null, 2));
//             const message = getValueFromJsonGraph(jsonGraph, ['json', ...action.falcorQuery], '?????') as string;
//             resolve({ message } as StatePage1);
//           });
//       });
//     } else {
//       return state;
//     }
//   }, initState);
// }

// // Falcorを通してデータを取得するReducer。戻り値がObservable<Promise<any>>になるのが特徴。
// export function stateReducerPage2(initState: any, dispatcher$: Observable<Action>, falcorModel: any): Observable<Promise<StatePage2>> {
//   return dispatcher$.scan((state: Promise<StatePage2>, action: Action) => {
//     if (action instanceof NextMessageFromFalcorPage2) {
//       return new Promise<StatePage2>(resolve => {
//         falcorModel
//           .get(action.falcorQuery)
//           .then(jsonGraph => {
//             // console.log(JSON.stringify(jsonGraph, null, 2));
//             const message = getValueFromJsonGraph(jsonGraph, ['json', ...action.falcorQuery], '?????') as string;
//             resolve({ message } as StatePage2);
//           });
//       });
//     } else {
//       return state;
//     }
//   }, initState);
// }

// // Falcorを通してデータを取得するReducer。戻り値がObservable<Promise<any>>になるのが特徴。
// export function stateReducerPage3(initState: any, dispatcher$: Observable<Action>, falcorModel: any): Observable<Promise<StatePage3>> {
//   return dispatcher$.scan((state: Promise<StatePage3>, action: Action) => {
//     if (action instanceof NextDocumentsFromFalcorPage3) {
//       return new Promise<StatePage3>(resolve => {
//         falcorModel
//           .get(action.falcorQuery)
//           .then(jsonGraph => {
//             // console.log(JSON.stringify(jsonGraph, null, 2));
//             const documents = getArrayFromJsonGraph(jsonGraph, ['json', ...action.targetLayerArray], []) as {}[];
//             resolve({ documents } as StatePage3);
//           });
//       });
//     } else {
//       return state;
//     }
//   }, initState);
// }

// // Falcorを通してデータを取得するReducer。戻り値がObservable<Promise<any>>になるのが特徴。
// export function stateReducerPage4(initState: any, dispatcher$: Observable<Action>, falcorModel: any): Observable<Promise<StatePage4>> {
//   return dispatcher$.scan((state: Promise<StatePage4>, action: Action) => {
//     if (action instanceof NextDocumentsFromFalcorPage4) {
//       return new Promise<StatePage4>(resolve => {
//         falcorModel
//           .get(action.falcorQuery)
//           .then(jsonGraph => {
//             // console.log(JSON.stringify(jsonGraph, null, 2)); // Falcorから返却されるJSON Graphを確認。        
//             const documents = getArrayFromJsonGraph(jsonGraph, ['json', ...action.targetLayerArrayOfDocuments], []) as {}[];
//             const totalItems = getValueFromJsonGraph(jsonGraph, ['json', ...action.targetLayerArrayOfTotalItems], 0) as number;
//             resolve({ documents, totalItems } as StatePage4);
//           });
//       });
//     } else {
//       return state;
//     }
//   }, initState);
// }
