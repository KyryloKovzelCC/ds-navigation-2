import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';
import { OutletService } from '../services/outlet.service';
import { HeaderMobileComponent } from '../header/header-mobile.component';
import { ContentPlaceholderComponent } from '../content-placeholder/content-placeholder.component';
import { getPageFadeSlideAnimation } from '../utils/angular.animations';

@Component({
  selector: 'app-ai-search',
  templateUrl: 'ai-search.page.html',
  styleUrls: ['ai-search.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    HeaderMobileComponent,
    ContentPlaceholderComponent,
  ],
  animations: [getPageFadeSlideAnimation('topToBottom')],
  host: { '[@pageFadeSlide]': '' },
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
