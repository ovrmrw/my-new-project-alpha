import { Subscription } from 'rxjs/Subscription';
import { Store } from '../app/store';

export class StoreService {
  constructor(
    protected store: Store
  ) { }

  set disposableSubscription(subscription: Subscription) {
    this.store.setDisposableSubscription(subscription, [this]);
  }
  disposeSubscriptions() {
    this.store.disposeSubscriptions([this]);
  }
}