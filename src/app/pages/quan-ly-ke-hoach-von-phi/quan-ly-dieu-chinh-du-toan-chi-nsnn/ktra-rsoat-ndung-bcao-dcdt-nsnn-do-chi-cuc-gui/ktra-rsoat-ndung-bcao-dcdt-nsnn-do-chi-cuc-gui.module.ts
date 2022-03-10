import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KtraRsoatNdungBcaoDcdtNsnnDoChiCucGuiRoutingModule } from './ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui-routing.module';
import { KtraRsoatNdungBcaoDcdtNsnnDoChiCucGuiComponent } from './ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    KtraRsoatNdungBcaoDcdtNsnnDoChiCucGuiComponent,
  ],
  imports: [
    CommonModule,
    KtraRsoatNdungBcaoDcdtNsnnDoChiCucGuiRoutingModule,
    ComponentsModule,
  ],
})

export class KtraRsoatNdungBcaoDcdtNsnnDoChiCucGuiModule {}
