import { Component, inject, input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: 'flow.page.html',
  styleUrls: ['flow.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons,
    IonTitle,
    IonContent,
    IonBackButton,
  ],
})
export class FlowPage {
  private readonly navigationService = inject(NavigationService);

  protected readonly title = input<string>('0');

  protected readonly outletIndex = this.navigationService.outletIndex;

  protected onNext(): void {
    this.navigationService.navigateWithinOutlet([
      (+this.title() + 1).toString(),
    ]);
  }

  protected onNewFlow(): void {
    this.navigationService.navigateWithinNewOutlet(['0']);
  }
}
