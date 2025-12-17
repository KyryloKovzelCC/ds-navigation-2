import { AfterViewInit, Component, computed, inject } from '@angular/core';
import { Location } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';
import { OutletService } from '../services/outlet.service';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { HeaderMobileComponent } from '../header/header-mobile.component';
import { ContentPlaceholderComponent } from '../content-placeholder/content-placeholder.component';

@Component({
  selector: 'app-ai-search',
  templateUrl: 'ai-search.page.html',
  styleUrls: ['ai-search.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ButtonComponent,
    IconComponent,
    HeaderMobileComponent,
    ContentPlaceholderComponent,
  ],
  host: { '[class.is-blurred]': 'true' },
})
export class AiSearchPage {
  private readonly navigationService = inject(NavigationService);
  private readonly outletService = inject(OutletService);

  protected readonly activeOutletIndex = this.outletService.activeOutletIndex;

  constructor() {
    this.outletService.activeOutletIndex.set(
      this.navigationService.outletIndex,
    );
  }

  protected onClose(): void {
    this.navigationService.navigateToNewContext(['trading', 'tabs', 'home']);
  }
}
