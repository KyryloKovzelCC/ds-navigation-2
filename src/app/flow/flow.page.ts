import { Component, inject, input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
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
    IonIcon,
  ],
})
export class FlowPage {
  private readonly navigationService = inject(NavigationService);

  protected readonly title = input<string>('0');
  protected readonly backPathSegments = input<string[] | undefined>();

  protected readonly outletIndex = this.navigationService.outletIndex;

  protected onBack(): void {
    this.navigationService.navigateBack(this.backPathSegments());
  }

  protected onNext(): void {
    this.navigationService.navigateForward([
      'flow',
      (+this.title() + 1).toString(),
    ]);
  }

  protected onNewFlow(): void {
    this.navigationService.navigateWithinNewOutlet(['flow', '0']);
  }

  public async dismissOutlet(): Promise<boolean> {
    return this.navigationService.dismissOutlet();
  }
}
