import { Component, inject, signal } from '@angular/core';
import {
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-tabs-page',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabBar, IonIcon, IonTabButton, IonTabs],
})
export class TabsPage {
  private readonly navigationService = inject(NavigationService);
  private readonly route = inject(ActivatedRoute);

  protected readonly tabs = [
    { path: 'home', name: 'Home', icon: 'storefront' },
    { path: 'watchlist', name: 'Watchlist', icon: 'alarm' },
    { path: 'portfolio', name: 'Portfolio', icon: 'bag' },
    { path: 'discover', name: 'Discover', icon: 'reader' },
  ];

  protected readonly currentTabIndex = signal(this.getCurrentTabIndex());

  protected onTabClick(tab: string, index: number) {
    if (index > this.currentTabIndex()) {
      this.navigationService.navigateForward(['trading', 'tabs', tab]);
    } else {
      this.navigationService.navigateBack(['trading', 'tabs', tab]);
    }

    this.currentTabIndex.set(index);
  }

  private getCurrentTabIndex(): number {
    const path = this.route.snapshot.children[0].url[0].path;
    return this.tabs.findIndex((tab) => tab.path === path);
  }
}
