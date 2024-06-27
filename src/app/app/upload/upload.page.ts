import { Component, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import html2canvas from 'html2canvas';

// import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// import { Ocr, TextDetections } from '@capacitor-community/image-to-text';

import {
  AlertController,
  LoadingController,
  Platform,
  ToastController,
  IonicModule,
} from '@ionic/angular';

// import {
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonContent,
//   IonButtons,
//   IonButton,
//   IonSegment,
//   IonSegmentButton,
//   IonLabel,
//   IonRow,
//   IonCol,
//   IonIcon,
//   IonItem,
//   IonInput,
//   IonFooter,
// } from '@ionic/angular/standalone';

import { Browser } from '@capacitor/browser';
import { Clipboard } from '@capacitor/clipboard';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import {
  FormsModule,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { from } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
  standalone: true,
  imports: [
    // IonFooter,
    // IonInput,
    // IonItem,
    // IonIcon,
    // IonCol,
    // IonRow,
    // IonLabel,
    // IonSegmentButton,
    // IonSegment,
    // IonButton,
    // IonButtons,
    // IonHeader,
    // IonToolbar,
    // IonTitle,
    // IonContent,
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class UploadPage implements OnInit {
  esCapacitor = false;

  segment = 'qr';

  qrText = '';

  scanResult = '';

  textDetections: any[] = [];

  scaneoCompleto: boolean = false;
  loading: boolean = false;

  rucEmisor: String = '80004444-2';
  razonSocialEmisor = 'VARIOS S.A.';
  timbradoNro: String = '45754877';
  fechaInicioVig: String = '01/01/2024';
  fechaFinVig: String = '01/01/2030';
  rucReceptor: String = '80002312-5';
  razonSocialReceptor: String = 'Morado S.A.';
  nroFactura: String = '001-001-0001234';
  fechaEmision: String = '01/06/2024';
  condicionVenta: String = 'Contado';
  montoTotal: String = '220.000';
  montoIva10: String = '20.000';
  montoIva5: String = '0';
  montoExenta: String = '0';
  montoTotalIVA: String = '20.000';
  tipoFactura: String = '';

  tipoDato: String = '';

  formImagen = new FormGroup({
    img: new FormControl(''),
  });

  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
    // private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.esCapacitor = false;
    if (this.platform.is('capacitor')) {
      console.log('es un dispositivo Movil');
      this.esCapacitor = true;
      // this.router.navigate(['app/home']);
    } else {
      console.log('es un dispositivo Web');
      //this.router.navigate(['dashboard/home']);
      // this.router.navigate(['app/home']);
    }
  }

  clean() {
    this.scanResult = '';
    this.textDetections = [];
    this.scaneoCompleto = false;
  }

  async readBarcodeFromImage() {
    const { files } = await FilePicker.pickImages({ limit: 1 });

    const path = files[0]?.path;

    if (!path) {
      console.log('no hay resultado');
      const toast = await this.toastController.create({
        message: 'No es un QR Valido...Intente nuevamente!',
        duration: 1000,
        color: 'danger',
        icon: 'clipboard-outline',
        position: 'middle',
      });
      toast.present();

      return;
    }

    // const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
    //   path,
    //   formats: [],
    // });

    // this.scanResult = barcodes[0].displayValue;
  }

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

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos aguarde...',
      // duration: 4000,
    });
    loading.present();
  }

  // async scanNow() {
  //   const photo = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: false,
  //     resultType: CameraResultType.Uri,
  //     source: CameraSource.Photos,
  //   });
  //   this.showLoading();

  //   const data: TextDetections = await Ocr.detectText({
  //     // filename: "./assets/img1.jpeg",
  //     filename: photo.path!,
  //   });

  //   console.log(data);

  //   this.textDetections = data.textDetections;
  //   this.loading = false;
  //   this.loadingController.dismiss();
  //   this.scaneoCompleto = true;

  //   console.log(this.textDetections);
  // }

  searchInArray(arr: string[]): string | null {
    this.tipoDato = 'rucEmisor';
    while ((this.tipoDato = 'montoTotalIVA')) {
      switch (this.tipoDato) {
        case 'rucEmisor':
          for (let str of arr) {
            if (str.toLowerCase().includes('RUC: '.toLowerCase())) {
              this.rucEmisor = str;
              this.tipoDato = 'timbradoNro';
              break;
            }
          }
          break;
        case 'timbradoNro':
          for (let str of arr) {
            if (str.toLowerCase().includes('Timbrado N°: '.toLowerCase())) {
              this.rucEmisor = str;
              this.tipoDato = 'fechaInicioVig';
              break;
            }
          }
          break;
        case 'fechaInicioVig':
          for (let str of arr) {
            if (
              str
                .toLowerCase()
                .includes('Fecha Inicio Vigencia: '.toLowerCase())
            ) {
              this.rucEmisor = str;
              this.tipoDato = 'fechaFinVig';
              break;
            }
          }
          break;
        case 'fechaFinVig':
          for (let str of arr) {
            if (
              str.toLowerCase().includes('Fecha Fin Vigencia: '.toLowerCase())
            ) {
              this.rucEmisor = str;
              this.tipoDato = 'rucReceptor';
              break;
            }
          }
          break;
        case 'rucReceptor':
          for (let str of arr) {
            if (str.toLowerCase().includes('Ruc / CI: '.toLowerCase())) {
              this.rucEmisor = str;
              // this.tipoDato = "razonSocialReceptor";
              this.tipoDato = 'nroFactura';
              break;
            }
          }
          break;
        // case "razonSocialReceptor":
        //   for (let str of arr) {
        //     if (str.toLowerCase().includes("Razon Social: ".toLowerCase())) {
        //       this.rucEmisor = str;
        //       this.tipoDato = "nroFactura";
        //       break;
        //     }
        //   }
        //   break;
        case 'nroFactura':
          for (let str of arr) {
            if (str.toLowerCase().includes('N°'.toLowerCase())) {
              this.rucEmisor = str;
              this.tipoDato = 'fechaEmision';
              break;
            }
          }
          break;
        case 'fechaEmision':
          for (let str of arr) {
            if (
              str.toLowerCase().includes('Fecha de Emision: '.toLowerCase())
            ) {
              this.rucEmisor = str;
              // this.tipoDato = "condicionVenta";
              this.tipoDato = 'montoTotal';
              break;
            }
          }
          break;
        // case "condicionVenta":
        //   for (let str of arr) {
        //     if (str.toLowerCase().includes("Ruc / CI: ".toLowerCase())) {
        //       this.rucEmisor = str;
        //       this.tipoDato = "montoTotal";
        //       break;
        //     }
        //   }
        //   break;
        case 'montoTotal':
          for (let str of arr) {
            if (str.toLowerCase().includes('Total '.toLowerCase())) {
              this.rucEmisor = str;
              this.tipoDato = 'montoIva10';
              break;
            }
          }
          break;
        case 'montoIva10':
          for (let str of arr) {
            if (str.toLowerCase().includes('10% '.toLowerCase())) {
              this.rucEmisor = str;
              this.tipoDato = 'montoIva5';
              break;
            }
          }
          break;
        case 'montoIva5':
          for (let str of arr) {
            if (str.toLowerCase().includes('5% '.toLowerCase())) {
              this.rucEmisor = str;
              // this.tipoDato = "montoExenta";
              this.tipoDato = 'montoTotalIVA';
              break;
            }
          }
          break;
        // case "montoExenta":
        //   for (let str of arr) {
        //     if (str.toLowerCase().includes(" ".toLowerCase())) {
        //       this.rucEmisor = str;
        //       this.tipoDato = "montoTotalIVA";
        //       break;
        //     }
        //   }
        //   break;
        default:
          break;
      }
    }

    // for (let str of arr) {
    //     if (str.includes(searchStr)) {
    //         return str;
    //     }
    // }
    return null;
  }

  searchArray(array: string[], query: string): string[] {
    return array.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }
}
