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
  selector: 'app-tab',
  templateUrl: 'tab.page.html',
  styleUrls: ['tab.page.scss'],
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
export class TabPage {
  private readonly navigationService = inject(NavigationService);

  protected readonly title = input<string>();

  public readonly outletIndex = this.navigationService.outletIndex;

  protected onNewFlow(): void {
    this.navigationService.navigateWithinNewOutlet(['0']);
  }
}
