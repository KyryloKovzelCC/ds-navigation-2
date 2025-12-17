import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  IonButtons,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header-mobile',
  imports: [
    IonButtons,
    IonToolbar,
    IonTitle,
    ButtonComponent,
    IconComponent,
    IonButton,
    IonIcon,
  ],
  templateUrl: './header-mobile.component.html',
  styleUrl: './header-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderMobileComponent {
  public readonly title = input<string>('');
  public readonly showBack = input<boolean>(false);
  public readonly showClose = input<boolean>(false);

  public readonly backClick = output<void>();
  public readonly closeClick = output<void>();
}
