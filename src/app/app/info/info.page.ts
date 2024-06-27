import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonFooter,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonButton,
    IonFooter,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class InfoPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
