import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OcrscanPage } from './ocrscan.page';

const routes: Routes = [
  {
    path: '',
    component: OcrscanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OcrscanPageRoutingModule {}
