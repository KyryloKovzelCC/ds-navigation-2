import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { QuickActionsService } from './services/quick-actions.service';
import { QuickActionsComponent } from './quick-actions/quick-actions.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, QuickActionsComponent],
})
export class AppComponent {
  private readonly quickActionsService = inject(QuickActionsService);

  protected readonly isQuickActionsOpen = this.quickActionsService.isOpen;
}
