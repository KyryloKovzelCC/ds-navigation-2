import { Component, inject, signal } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { QuickActionsService } from './services/quick-actions.service';
import { QuickActionsComponent } from './quick-actions/quick-actions.component';
import { quickActionsAnimation } from './utils/angular.animations';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, QuickActionsComponent],
  animations: [quickActionsAnimation],
})
export class AppComponent {
  private readonly quickActionsService = inject(QuickActionsService);

  protected readonly isQuickActionsOpen = this.quickActionsService.isOpen;

  protected readonly animationDone = signal(true);
}
