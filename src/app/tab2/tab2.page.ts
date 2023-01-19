import { Component } from '@angular/core';
import { DeliveredNotificationSchema, LocalNotifications } from '@capacitor/local-notifications';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  recordatorios : DeliveredNotificationSchema [] = [];
  constructor(private navCtrl: NavController) {

  }

  ionViewWillEnter(){
    LocalNotifications.getDeliveredNotifications().then(list => {
       this.recordatorios = list.notifications.filter(item => !item.group && item.id > 1);
    });
  }

}
