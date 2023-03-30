import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveredNotifications, DeliveredNotificationSchema, LocalNotifications } from '@capacitor/local-notifications';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-recordatorio',
  templateUrl: './recordatorio.page.html',
  styleUrls: ['./recordatorio.page.scss'],
})
export class RecordatorioPage implements OnInit {
  id: string | null = "";
  item : Recordatorio = {
    id: undefined,
    titulo: undefined
  };
  constructor(private activateRoute : ActivatedRoute, private router : Router, private database : DatabaseService) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.router.navigate(['/']);
      }
      else {
        this.id = paramMap.get('id');
        this.getItemFromList();
      }
    });
  }

  async getItemFromList() {
    let temp = await this.database.get(this.id!);
    if(!temp){
      alert("No se encontró el elemento");
      this.router.navigate(['/']);
    }
    else {
      this.item.id = this.id!;
      this.item.titulo = temp;
    }
  }

  async getList() : Promise<DeliveredNotificationSchema[]>{
    return (await LocalNotifications.getDeliveredNotifications()).notifications;
  }

  async finalizar() {
    let itemNotification : DeliveredNotificationSchema;
    try {
      let temp : DeliveredNotificationSchema[] = await this.getList();
      temp = temp.filter(item => item.id == Number(this.id));
      if(temp.length == 0 ){
        alert("No se encontró el elemento");
        this.router.navigate(['/']);
        return;
      }
      else {
        itemNotification = temp[0];
      }
      //Eliminados de storage
      this.database.remove(this.id!);

      let remove : DeliveredNotificationSchema[] = [];
      remove.push(itemNotification);      
      let rem :DeliveredNotifications = {
        notifications: remove
      };
      LocalNotifications.removeDeliveredNotifications(rem).then(result => {
          alert("Recordatorio Eliminado");
          this.router.navigate(['/']);
      }).catch(err => {
        alert("Error al intentar eliminar el recodatorio " + err)
      })
    } 
    catch (err) {
      alert("Error al intentar cerrar el recordatorio.")
    }
  }
}

class Recordatorio {
  id : String | undefined ;
  titulo: String | undefined;
}