import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrscanPage } from './qrscan.page';

import { QrscanPageRoutingModule } from './qrscan-routing.module';
import { QrCodeModule } from 'ng-qrcode';

// import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    QrscanPageRoutingModule,
    QrCodeModule,
  ],
  declarations: [],
})
export class QrscanPageModule {}
