import { Component, OnInit } from '@angular/core';

import html2canvas from 'html2canvas';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import {
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
// import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
// import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonRow,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonFooter,
} from '@ionic/angular/standalone';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.page.html',
  styleUrls: ['./qrscan.page.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonLabel,
    IonItem,
    IonIcon,
    IonCol,
    IonRow,
    IonButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class QrscanPage implements OnInit {
  segment = 'scann';

  qrText = '';

  scanResult = 'https://ekuatia.set.gov.';

  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
    // private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    if (this.platform.is('capacitor')) {
      // BarcodeScanner.isSupported().then();
      // BarcodeScanner.checkPermissions().then();
      // BarcodeScanner.removeAllListeners();
    }
  }

  async startScan(val?: number) {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: val || 17,
        cameraDirection: 1,
      });
      console.log(result);

      return result.ScanResult;
    } catch (error) {
      throw error;
    }

    // const modal = await this.modalController.create({
    //   component: BarcodeScanningModalComponent,
    //   cssClass: 'barcode-scanning-modal',
    //   showBackdrop: false,
    //   mode: 'md',
    //   componentProps: {
    //     formats: ['QrCode'],
    //     lensFacing: LensFacing.Back,
    //   },
    // });

    // await modal.present();

    // const { data } = await modal.onWillDismiss();

    // if (data) {
    //   this.scanResult = data?.barcode?.displayValue;
    // }
  }

  // async readBarcodeFromImage() {
  //   const { files } = await FilePicker.pickImages();

  //   const path = files[0]?.path;

  //   if (!path) {
  //     console.log('no hay resultado');

  //     return;
  //   }

  //   const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
  //     path,
  //     formats: [],
  //   });

  //   this.scanResult = barcodes[0].displayValue;
  // }

  captureScreen() {
    const element = document.getElementById('qrImage') as HTMLElement;

    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      if (this.platform.is('capacitor')) {
        this.downloadImageMob(canvas);
      } else {
        this.downloadImageWeb(canvas);
      }
    });
  }

  downloadImageWeb(canvas: HTMLCanvasElement) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'qr-png';
    link.click();
  }

  async downloadImageMob(canvas: HTMLCanvasElement) {
    const base64 = canvas.toDataURL();
    const path = 'qr-png';

    const loading = await this.loadingController.create({
      spinner: 'crescent',
    });
    await loading.present();

    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Cache,
    })
      .then(async (resp) => {
        let uri = resp.uri;

        await Share.share({ url: uri });

        await Filesystem.deleteFile({
          path,
          directory: Directory.Cache,
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  writeToClipboard = async () => {
    await Clipboard.write({
      string: this.scanResult,
    });

    const toast = await this.toastController.create({
      message: 'Copiado Con exito',
      duration: 1000,
      color: 'tertiary',
      icon: 'clipboard-outline',
      position: 'middle',
    });
    toast.present();
  };

  isUrl() {
    //expresion regular
    let regex = /\.(com|net|io|me|crypto|ai|set|gov)\b/i;

    return regex.test(this.scanResult);
  }

  openCapacitorSite = async () => {
    const alert = await this.alertController.create({
      header: '¡Confirmacion!',
      message: 'Quieres abrir el enlace en el navegador...?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Abrir',
          handler: async () => {
            let url = this.scanResult;

            if (!this.validarURL(this.scanResult)) {
              console.log('no es un enlace valido de la SET');
              const toast = await this.toastController.create({
                message:
                  'No se puede acceder, no es un enlace valido de la SET',
                duration: 1000,
                color: 'danger',
                icon: 'clipboard-outline',
                position: 'middle',
              });
              toast.present();
              // url = 'https://' + this.scanResult;
            }
            if (this.validarURLSET(this.scanResult)) {
              console.log('es un enlace valido de la SET');
              await Browser.open({ url });
            } else {
              console.log('no es un enlace valido de la SET');
              const toast = await this.toastController.create({
                message:
                  'No se puede acceder, no es un enlace valido de la SET',
                duration: 1000,
                color: 'danger',
                icon: 'clipboard-outline',
                position: 'middle',
              });
              toast.present();
            }

            //console.log(url);
          },
        },
      ],
    });

    await alert.present();
  };

  validarURL(url: string): boolean {
    const patron = /^https?:\/\//;
    return patron.test(url);
  }

  validarURLSET(url: string): boolean {
    const patron = /^https:\/\/ekuatia\.set\.gov\.py\/.+$/;
    return patron.test(url);
  }
}
