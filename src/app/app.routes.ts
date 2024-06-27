import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./app/aplication.routes').then((m) => m.APLICATION_ROUTES),
  },
  // {
  //   path: 'home',
  //   loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  // },
  // {
  //   path: 'app/home',
  //   loadComponent: () => import('./app/home/home.page').then((m) => m.HomePage),
  // },
  // {
  //   path: 'dashboard/home',
  //   loadComponent: () =>
  //     import('./dashboard/home/home.component').then((m) => m.HomeComponent),
  // },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full',
  // },
];
