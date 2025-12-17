import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { QuickActionsService } from '../services/quick-actions.service';

@Component({
  selector: 'app-quick-actions',
  templateUrl: 'quick-actions.component.html',
  styleUrls: ['quick-actions.component.scss'],
  imports: [ButtonComponent, IconComponent],
})
export class QuickActionsComponent {
  private readonly quickActionsService = inject(QuickActionsService);

  protected onClose(): void {
    this.quickActionsService.isOpen.set(false);
  }
}
