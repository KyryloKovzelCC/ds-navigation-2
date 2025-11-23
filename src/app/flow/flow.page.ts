import { Component, inject, input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonBackButton,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
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
    IonIcon,
    IonTitle,
    IonContent,
    IonBackButton,
  ],
})
export class FlowPage {
  private readonly navigationService = inject(NavigationService);

  protected readonly title = input<string>('0');

  public readonly outletIndex = this.navigationService.outletIndex;

  protected onNext(): void {
    this.navigationService.navigateWithinOutlet([
      (+this.title() + 1).toString(),
    ]);
  }

  protected onNewFlow(): void {
    this.navigationService.navigateWithinNewOutlet(['0']);
  }
}
