import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KtraRsoatNdungBcaoDcdtNsnnDoChiCucGuiComponent } from './ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui.component';

const routes: Routes = [
  {
    path: '',
    component: KtraRsoatNdungBcaoDcdtNsnnDoChiCucGuiComponent
    ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KtraRsoatNdungBcaoDcdtNsnnDoChiCucGuiRoutingModule {}
