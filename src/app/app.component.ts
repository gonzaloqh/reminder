import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ScheduleOptions } from '@capacitor/local-notifications/dist/esm/definitions';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform : Platform) {
    this.platform.ready().then(() => {
    })
  }

}
