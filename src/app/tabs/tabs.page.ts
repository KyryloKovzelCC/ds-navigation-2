import { Component, inject, signal } from '@angular/core';
import { IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { QuickActionsService } from '../services/quick-actions.service';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-tabs-page',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabBar, IconComponent, IonTabButton, IonTabs, ButtonComponent],
})
export class TabsPage {
  private readonly navigationService = inject(NavigationService);
  private readonly route = inject(ActivatedRoute);
  private readonly quickActionsService = inject(QuickActionsService);

  protected readonly tabs = [
    { path: 'home', name: 'Home', icon: 'home' },
    { path: 'watchlist', name: 'Watchlist', icon: 'watchlist' },
    { path: 'portfolio', name: 'Portfolio', icon: 'portfolio' },
    { path: 'discover', name: 'Discover', icon: 'discover' },
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

  protected openQuickActions(): void {
    this.quickActionsService.isOpen.set(true);
  }

  private getCurrentTabIndex(): number {
    const path = this.route.snapshot.children[0].url[0].path;
    return this.tabs.findIndex((tab) => tab.path === path);
  }
}
