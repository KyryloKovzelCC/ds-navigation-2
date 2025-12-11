import { Route, Routes } from '@angular/router';
import { ModalShellComponent } from './modal-shell/modal-shell.component';
import {
  FLOW_OUTLET_INDEX,
  NavigationService,
} from './services/navigation.service';

const tabsRoutes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        data: {
          title: 'Home',
          tabIndex: 0,
        },
        loadComponent: () => import('./tab/tab.page').then((m) => m.TabPage),
      },
      {
        path: 'watchlist',
        data: {
          title: 'Watchlist',
          tabIndex: 1,
        },
        loadComponent: () => import('./tab/tab.page').then((m) => m.TabPage),
      },
      {
        path: 'portfolio',
        data: {
          title: 'Portfolio',
          tabIndex: 2,
        },
        loadComponent: () => import('./tab/tab.page').then((m) => m.TabPage),
      },
      {
        path: 'discover',
        data: {
          title: 'Discover',
          tabIndex: 3,
        },
        loadComponent: () => import('./tab/tab.page').then((m) => m.TabPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

const flowRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./tabs-flow/tabs-flow.page').then((m) => m.TabsFlowPage),
    children: [
      {
        path: '0',
        data: {
          title: '0',
        },
        loadComponent: () => import('./flow/flow.page').then((m) => m.FlowPage),
      },
      {
        path: '1',
        data: {
          title: '1',
          backPathSegments: ['flow', '0'],
        },
        loadComponent: () => import('./flow/flow.page').then((m) => m.FlowPage),
      },
      {
        path: '2',
        data: {
          title: '2',
          backPathSegments: ['flow', '1'],
        },
        loadComponent: () => import('./flow/flow.page').then((m) => m.FlowPage),
      },
      {
        path: '3',
        data: {
          title: '3',
          backPathSegments: ['flow', '2'],
        },
        loadComponent: () => import('./flow/flow.page').then((m) => m.FlowPage),
      },
      {
        path: '4',
        data: {
          title: '4',
          backPathSegments: ['flow', '3'],
        },
        loadComponent: () => import('./flow/flow.page').then((m) => m.FlowPage),
      },
      {
        path: '',
        redirectTo: '0',
        pathMatch: 'full',
      },
    ],
  },
];

const flowChildren: Routes = [
  {
    path: 'flow',
    loadComponent: () =>
      import('./modal-shell/modal-shell.component').then(
        (m) => m.ModalShellComponent,
      ),
    children: [...flowRoutes],
  },
];

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ai-search',
        loadComponent: () =>
          import('./ai-search/ai-search.page').then((m) => m.AiSearchPage),
      },
      {
        path: '',
        redirectTo: 'ai-search',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    outlet: 'flow0',
    providers: [
      NavigationService,
      {
        provide: FLOW_OUTLET_INDEX,
        useValue: 0,
      },
    ],
    children: [
      {
        path: 'trading',
        data: {
          outletIndex: 0,
        },
        loadComponent: () =>
          import('./modal-shell/modal-shell.component').then(
            (m) => m.ModalShellComponent,
          ),
        children: tabsRoutes,
      },
    ],
  },
  {
    path: '',
    outlet: 'flow1',
    providers: [
      NavigationService,
      {
        provide: FLOW_OUTLET_INDEX,
        useValue: 1,
      },
    ],
    children: flowChildren,
  },
  {
    path: '',
    outlet: 'flow2',
    providers: [
      NavigationService,
      {
        provide: FLOW_OUTLET_INDEX,
        useValue: 2,
      },
    ],
    children: flowChildren,
  },
  {
    path: '',
    outlet: 'flow3',
    providers: [
      NavigationService,
      {
        provide: FLOW_OUTLET_INDEX,
        useValue: 3,
      },
    ],
    children: flowChildren,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];
