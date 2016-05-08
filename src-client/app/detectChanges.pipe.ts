import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription'
import {Subject}from'rxjs/Subject'
import 'rxjs/add/observable/from';
// import 'rxjs/add/observable/scan'
import 'rxjs/add/operator/scan';

@Pipe({
  name: 'dc',
  pure: true
})
export class DetectChangesPipe implements PipeTransform {
  static flag = false;
  static subject: Subject<any>;
  transform(value: any): any {
    // console.log(value);
    // this.subscription = Observable.from([value])
    //   .debounceTime(1000)
    //   .subscribe(() => this.cd.detectChanges());
    // if (!DetectChangesPipe.flag) {
    //   DetectChangesPipe.flag = true;
    //   setTimeout(() => {
    //     this.cd.detectChanges();
    //     DetectChangesPipe.flag = false;
    //   }, 500)
    // }
    // console.log(subject);
    // if(subject)
    // subject.next(value);

    setTimeout(() => {
      this.cd.detectChanges();
    }, 100)
    return value;
  }
  constructor(private cd: ChangeDetectorRef) { }
}