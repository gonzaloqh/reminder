import { ChangeDetectorRef, Component } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { DeliveredNotificationSchema, LocalNotifications, PendingLocalNotificationSchema, ScheduleOptions } from '@capacitor/local-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  titulo : string = "";
  recording = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router) { 
    SpeechRecognition.requestPermission();
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

      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        console.log('/remind/' + notification.notification.id)
        this.router.navigate(['/remind/' + notification.notification.id]);
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

  async guardar() {
    let opcions : ScheduleOptions = {
      notifications: [
        {
          id: await this.getLastId(),
          title: this.titulo,
          body: this.titulo,
          ongoing: true,
          autoCancel: false,
        }
      ]
    }
    LocalNotifications.schedule(opcions).then(() =>{
      this.titulo = "";
      alert("Recordatorio Guardado");
    }).catch(err => {
      alert("Error a intentar guardar: " + err);
    });
    
  }

  async getLastId() : Promise<number>{
    let temp : DeliveredNotificationSchema[] = await this.getList();
    temp = temp.filter(item => !item.group && item.id > 1);
    console.log(temp);
    if(temp.length > 0 ) {
      let objMax = temp.reduce((max, curren) => max.id > curren.id ? max : curren);
      return objMax.id + 1;
    }
    else {
      return 2;
    }
    
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






