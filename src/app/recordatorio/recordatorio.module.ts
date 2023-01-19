import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordatorioPageRoutingModule } from './recordatorio-routing.module';

import { RecordatorioPage } from './recordatorio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordatorioPageRoutingModule
  ],
  declarations: [RecordatorioPage]
})
export class RecordatorioPageModule {}
