import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import lodash from 'lodash';
import { AppPage1Service } from './page1.service';
import { appRoot } from '../../src-middle/utils';
import { Credential, Translation } from '../../src-middle/types';

///////////////////////////////////////////////////////////////////////////////////
// Helper Components
@Component({
  selector: 'sg-translation',
  template: `
    <div>{{translation | json}}</div>
  `
})
class TranslationComponent {
  @Input() translation: Translation;
}

@Component({
  selector: 'sg-pairs',
  template: `
    <div><ul><li *ngFor="let pair of reversedPairs">{{pair.original}} -> {{pair.translated}}</li></ul></div>
  `
})
class PairsComponent {
  @Input() pairs: LangPair[];

  get reversedPairs() {
    return lodash.cloneDeep(this.pairs).reverse();
  }
}

@Component({
  selector: 'sg-history',
  template: `
    <div><ul><li *ngFor="let t of translations">{{t | json}}</li></ul></div>
  `
})
class HistoryComponent {
  @Input() translations: Translation[];
}


///////////////////////////////////////////////////////////////////////////////////
// Main Component
@Component({
  selector: 'sg-page1',
  template: `
    <h3>{{title}} - PAGE1</h3>
    <div>
      ClientId: <input type="text" [(ngModel)]="clientId" />
    </div>
    <div>
      ClientSecret: <input type="text" [(ngModel)]="clientSecret" />
    </div>
    <hr />
    <div>
      翻訳したい日本語: <input type="text" [(ngModel)]="text" />
    </div>
    <button (click)="onClick($event)">Translate</button>
    <hr *ngIf="translationByPush" />
    <sg-translation [translation]="translationByPush"></sg-translation>
    <hr *ngIf="pairsByPush.length > 0" />
    <sg-pairs [pairs]="pairsByPush"></sg-pairs>
    <hr />
    <sg-history [translations]="historyByPush"></sg-history>
  `,
  directives: [TranslationComponent, PairsComponent, HistoryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppPage1Component implements OnInit {
  private static afterRegister: boolean;
  private clientId: string;
  private clientSecret: string;

  constructor(
    private service: AppPage1Service,
    private cd: ChangeDetectorRef
  ) {  }
  ngOnInit() {
    this.service.disposeSubscriptions(); // registerSubscriptionsの前に、登録済みのsubscriptionを全て破棄する。
    this.registerSubscriptions();
  }

  registerSubscriptions() {
    this.service.disposableSubscription = this.service.requestCredential$(appRoot + 'azureDataMarket.secret.json')
      .subscribe(credential => {
        this.clientId = credential.ClientId;
        this.clientSecret = credential.ClientSecret;
        this.cd.markForCheck(); // OnPush環境ではWaitが発生する処理を待機するときにはmarkForCheckが必要。
      });

    this.service.disposableSubscription = this.service.getTranslations$(3)
      .subscribe(translations => {
        console.log('DetectChange: ' + (translations.length > 2 ? translations[2].translated : undefined) + ' -> ' + (translations.length > 1 ? translations[1].translated : undefined) + ' -> ' + (translations.length > 0 ? translations[0].translated : undefined) + ' on Page1');
        this.historyByPush = translations;
      });

    this.service.disposableSubscription = this.service.getTitles$(3)
      .subscribe(titles => {
        console.log('DetectChange: ' + titles[2] + ' -> ' + titles[1] + ' -> ' + titles[0] + ' on Page1');
      });
  }

  onClick(event: MouseEvent) {
    this.service.requestTranslation$(this.text, this.clientId, this.clientSecret)
      .subscribe(translation => {
        this.translationByPush = translation;
        this.pairsByPush.push({ original: translation.text, translated: translation.translated });
        this.cd.markForCheck(); // OnPush環境ではWaitが発生する処理を待機するときにはmarkForCheckが必要。
      });
  }

  set text(text) { this.service.setText(text); }
  get text() { return this.service.getText(); }

  get title() { return this.service.getTitle(); }

  // Observableにより更新される変数なので勝手に変更しないこと。
  private translationByPush: Translation;
  private pairsByPush: LangPair[] = [];
  private historyByPush: Translation[];
}


///////////////////////////////////////////////////////////////////////////////////
// Local Interfaces
interface LangPair {
  original: string;
  translated: string;
}