import { Routes } from '@angular/router';

export const APLICATION_ROUTES: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'qrscan',
    loadComponent: () =>
      import('./qrscan/qrscan.page').then((m) => m.QrscanPage),
  },
  {
    path: 'ocrscan',
    loadComponent: () =>
      import('./ocrscan/ocrscan.page').then((m) => m.OcrscanPage),
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./upload/upload.page').then((m) => m.UploadPage),
  },
  {
    path: 'info',
    loadComponent: () => import('./info/info.page').then((m) => m.InfoPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
