import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Store, StoreService } from '../store';
import { AppPage1Service as AP1S, AppPage2Service as AP2S } from '../services.ref';
import { Translation } from '../types.ref';

////////////////////////////////////////////////////////////////////////////
// Service
@Injectable()
export class AppPage4Service extends StoreService {
  constructor(store: Store) { super(store); }
}

////////////////////////////////////////////////////////////////////////////
// State (Declared only getters from Store)
@Injectable()
export class AppPage4State {
  constructor(private store: Store) { }
  
  get text() { return this.store.getState<string>(AP1S.TRANSLATION_TEXTINPUT_IDENTIFIER); }
  get text$() { return this.store.getState$<string>(AP1S.TRANSLATION_TEXTINPUT_IDENTIFIER); }

  get title() { return this.store.getState<string>(AP2S.PAGETITLE_IDENTIFIER); }
  get title$() { return this.store.getState$<string>(AP2S.PAGETITLE_IDENTIFIER); }
}