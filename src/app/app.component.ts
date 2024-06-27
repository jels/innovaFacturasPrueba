import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
  // constructor(private platform: Platform, private router: Router) {}

  // ngOnInit(): void {
  //   if (this.platform.is('capacitor')) {
  //     console.log('es un dispositivo Movil');
  //     this.router.navigate(['app/home']);
  //   } else {
  //     console.log('es un dispositivo Web');
  //     //this.router.navigate(['dashboard/home']);
  //     this.router.navigate(['app/home']);
  //   }
  // }
}
