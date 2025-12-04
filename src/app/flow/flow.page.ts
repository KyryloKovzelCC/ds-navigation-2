import { Component, inject, input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';
import { OutletService } from '../services/outlet.service';

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
    IonIcon,
  ],
})
export class FlowPage {
  private readonly outletService = inject(OutletService);
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

  public async dismissOutlet(): Promise<boolean> {
    this.outletService.activeOutletIndex.set(
      this.outletIndex > 0 ? this.outletIndex - 1 : undefined,
    );

    return this.navigationService.dismissOutlet();
  }
}
