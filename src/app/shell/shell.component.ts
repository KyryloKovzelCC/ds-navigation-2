import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';
import { OutletService } from '../services/outlet.service';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-shell',
  templateUrl: 'shell.component.html',
  styleUrls: ['shell.component.scss'],
  imports: [IonRouterOutlet],
})
export class ShellComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly outletService = inject(OutletService);

}
