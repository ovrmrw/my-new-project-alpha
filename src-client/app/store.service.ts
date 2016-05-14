import { Subscription } from 'rxjs/Rx';
import { Store } from '../app/store';

export class StoreService {
  constructor(
    protected store: Store
  ) { }

  set disposableSubscription(subscription: Subscription) {
    this.store.setDisposableSubscription(subscription, [this]);
  }
  disposeSubscriptionsBeforeRegister() {
    this.store.disposeSubscriptions([this]);
  }

  clearStatesAndLocalStorage() {
    this.store.clearStatesAndLocalStorage();
  }
}