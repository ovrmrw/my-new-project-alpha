import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '../app/store';

export const TITLE = 'title';

@Injectable()
export class AppPage2Service {
  constructor(
    private store: Store
  ) { }

  setTitle(title: string) { this.store.setState(title, [TITLE, this]); }
  getTitle() { return this.store.getState<string>([TITLE, this]); }
  getTitles$(limit?: number) { return this.store.getStates$<string>(limit, [TITLE, this]).debounceTime(10); }
  
  set disposableSubscription(subscription: Subscription) { this.store.setDisposableSubscription(subscription, [this]); }
  disposeSubscriptions() { this.store.disposeSubscriptions([this]); }
}