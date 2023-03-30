import { ChangeDetectorRef, Component } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { DeliveredNotificationSchema, LocalNotifications, PendingLocalNotificationSchema, ScheduleOptions } from '@capacitor/local-notifications';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  titulo : string = "";
  recording = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router, private database : DatabaseService) { 
    SpeechRecognition.requestPermission();
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      this.guardarDina(notification.notification.title).then(asdasd => {
        this.findbytitle(notification.notification.title).then(res => {
          console.log('/remind/' + res)
          this.router.navigate(['/remind/' + res]);
        })
      }).catch(err => {
        alert("Error al reestablecer el recordatorio");
      });
      
    });
  }

  ionViewWillEnter(){
    this.titulo = "";
  }

  async start(){
    const { available} = await SpeechRecognition.available();
    if(available) {
      this.recording = true;

      SpeechRecognition.start({
        language: "es-PE",
        maxResults: 3,
        prompt: "Hable ahora",
        partialResults: true,
        popup: false,
      });      

      SpeechRecognition.addListener("partialResults", (data: any) => {
        console.log("partialResults was fired", data.matches);
        if(data.matches && data.matches.length > 0) {
          this.titulo = data.matches[0];
          this.changeDetectorRef.detectChanges();
        }

        //Anroid
        if(data.value && data.value.length > 0) {
          this.titulo = data.value[0];
          this.changeDetectorRef.detectChanges();
        }
      });
    } 
  }

  async guardarDina(tit : string) {
    let opcions : ScheduleOptions = {
      notifications: [
        {
          id: await this.getLastId(),
          title: tit,
          body: tit,
          ongoing: true,
          autoCancel: false,
        }
      ]
    }    
    LocalNotifications.schedule(opcions).then(() =>{
      this.titulo = "";
    }).catch(err => {
    });
    
  }

  async guardar() {
    let id_local = await this.getLastId();
    let opcions : ScheduleOptions = {
      notifications: [
        {
          id: id_local,
          title: this.titulo,
          body: this.titulo,
          ongoing: true,
          autoCancel: false,
        }
      ]
    }

    //Guardar la notificacion en storage
    this.database.set(String(id_local), this.titulo);
    
    LocalNotifications.schedule(opcions).then(() =>{
      this.titulo = "";
      alert("Recordatorio Guardado");
    }).catch(err => {
      alert("Error a intentar guardar: " + err);
    });
    
  }

  async getLastId() : Promise<number>{
    let temp : DeliveredNotificationSchema[] = await this.getList();
    temp = temp.filter(item => !item.group);
    console.log(temp);
    if(temp.length > 0 ) {
      let objMax = temp.reduce((max, curren) => max.id > curren.id ? max : curren);
      return objMax.id + 1;
    }
    else {
      return 2;
    }
    
  }

  async findbytitle(tit : string) {
    let temp : DeliveredNotificationSchema[] = await this.getList();
    temp = temp.filter(item => !item.group);
    console.log(temp);
    console.log(tit);
    let temp2 = temp.find(item => {return item.title == tit});
    console.log(temp2);
    return temp2?.id;
  }

  async getList() : Promise<DeliveredNotificationSchema[]>{
    return (await LocalNotifications.getDeliveredNotifications()).notifications;
  }

  async stop(){
    this.recording = false;
    await SpeechRecognition.stop();
  }

  speakText(){
    console.log("spp" +SpeechRecognition.getSupportedLanguages());
   /*  TextToSpeech.speak({
      text: this.titulo
    }); */
  }

  

}






