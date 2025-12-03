import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ai-search',
  templateUrl: 'tabs-flow.page.html',
  styleUrls: ['tabs-flow.page.scss'],
  imports: [RouterModule, IonRouterOutlet],
})
export class TabsFlowPage {}
