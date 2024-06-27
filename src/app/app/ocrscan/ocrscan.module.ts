import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OcrscanPageRoutingModule } from './ocrscan-routing.module';

import { OcrscanPage } from './ocrscan.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, OcrscanPageRoutingModule],
  declarations: [],
})
export class OcrscanPageModule {}
