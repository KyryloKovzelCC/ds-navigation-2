import { Component, inject } from '@angular/core';
import {
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonTab,
  IonTabs,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ai-search',
  templateUrl: 'tabs-flow.page.html',
  styleUrls: ['tabs-flow.page.scss'],
  imports: [IonTabBar, IonIcon, IonTabButton, IonTab, IonTabs, RouterModule],
})
export class TabsFlowPage {}
