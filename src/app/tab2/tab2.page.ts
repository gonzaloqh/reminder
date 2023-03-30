import { Component } from '@angular/core';
import { DeliveredNotificationSchema, LocalNotifications } from '@capacitor/local-notifications';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  recordatorios: Recordatorio[] | undefined = [];
  constructor(private navCtrl: NavController, private database : DatabaseService) {

  }

  async ionViewWillEnter(){
    let keys = await this.database.getAll();
    this.recordatorios = [];
    keys?.forEach(item => {
      this.database.get(item)?.then(result => {
        let newRecordatorio : Recordatorio = {
          id: item,
          titulo: result
        };
        this.recordatorios?.push(newRecordatorio);
      })
    });

  }

}


class Recordatorio {
  id : String | undefined ;
  titulo: String | undefined;
}