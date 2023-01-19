import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordatorioPage } from './recordatorio.page';

const routes: Routes = [
  {
    path: '',
    component: RecordatorioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordatorioPageRoutingModule {}
