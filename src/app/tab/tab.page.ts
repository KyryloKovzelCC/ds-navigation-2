import { Component, inject, input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';
import { slideUpAndDownTransition } from '../utils/animations';

@Component({
  selector: 'app-tab',
  templateUrl: 'tab.page.html',
  styleUrls: ['tab.page.scss'],
  imports: [IonHeader, IonToolbar, IonButton, IonButtons, IonTitle, IonContent],
  host: { '[attr.data-tab-index]': 'tabIndex()' },
})
export class TabPage {
  private readonly navigationService = inject(NavigationService);

  protected readonly tabIndex = input<number>();
  protected readonly title = input<string>();

  public readonly outletIndex = this.navigationService.outletIndex;

  protected onNewFlow(): void {
    this.navigationService.navigateWithinNewOutlet(['flow', '0']);
  }

  protected onSwitch(): void {
    this.navigationService.dismissOutlet(['switch'], {
      animation: slideUpAndDownTransition,
    });
  }
}
