import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
  withComponentInputBinding,
  UrlSerializer,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { horizontalTransition } from './app/utils/animations';
import { FlowUrlSerializer } from './app/core/flow-url.serializer';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      navAnimation: horizontalTransition,
      mode: 'ios',
    }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
    ),
    { provide: UrlSerializer, useClass: FlowUrlSerializer },
  ],
});
