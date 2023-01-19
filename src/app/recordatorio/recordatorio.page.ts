import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveredNotifications, DeliveredNotificationSchema, LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-recordatorio',
  templateUrl: './recordatorio.page.html',
  styleUrls: ['./recordatorio.page.scss'],
})
export class RecordatorioPage implements OnInit {
  id: string | null = "";
  item : DeliveredNotificationSchema = {
    id: 0,
    title: '',
    body: ''
  };
  constructor(private activateRoute : ActivatedRoute, private router : Router) { }

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
    let temp : DeliveredNotificationSchema[] = await this.getList();
    temp = temp.filter(item => item.id == Number(this.id));
    if(temp.length == 0 ){
      alert("No se encontró el elemento");
      this.router.navigate(['/']);
    }
    else {
      this.item = temp[0];
    }
  }

  async getList() : Promise<DeliveredNotificationSchema[]>{
    return (await LocalNotifications.getDeliveredNotifications()).notifications;
  }

  finalizar() {
    try {
      let remove : DeliveredNotificationSchema[] = [];
      remove.push(this.item);      
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
