import { Component, OnInit } from '@angular/core';

import html2canvas from 'html2canvas';

// import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Ocr, TextDetections } from '@capacitor-community/image-to-text';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonFooter,
  IonButtons,
} from '@ionic/angular/standalone';

import {
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';

import { Browser } from '@capacitor/browser';
import { Clipboard } from '@capacitor/clipboard';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ocrscan',
  templateUrl: './ocrscan.page.html',
  styleUrls: ['./ocrscan.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonFooter,
    IonInput,
    IonLabel,
    IonItem,
    IonIcon,
    IonButton,
    IonCol,
    IonRow,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class OcrscanPage implements OnInit {
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
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    // if (this.platform.is('capacitor')) {
    //   BarcodeScanner.isSupported().then();
    //   BarcodeScanner.checkPermissions().then();
    //   BarcodeScanner.removeAllListeners();
    // }
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos aguarde...',
      duration: 4000,
    });

    loading.present();
  }

  async scanNow() {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    this.showLoading();

    const data: TextDetections = await Ocr.detectText({
      // filename: "./assets/img1.jpeg",
      filename: photo.path!,
    });

    console.log(data);

    this.textDetections = data.textDetections;
    this.loading = false;
    this.loadingController.dismiss();
    this.scaneoCompleto = true;

    console.log(this.textDetections);

    // for (let detection of data.textDetections) {
    //   console.log(detection.text);
    // }
  }

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
