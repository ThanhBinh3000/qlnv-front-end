import { LapPhuongAnPhanBoDuToanChiNsnnChoDviComponent } from './lap-phuong-an-phan-bo-du-toan-chi-nsnn-cho-dvi.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LapPhuongAnPhanBoDuToanChiNsnnChoDviRoutingModule } from './lap-phuong-an-phan-bo-du-toan-chi-nsnn-cho-dvi-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    LapPhuongAnPhanBoDuToanChiNsnnChoDviComponent,
  ],
  imports: [
    CommonModule,
    LapPhuongAnPhanBoDuToanChiNsnnChoDviRoutingModule,
    ComponentsModule,
  ],
})

export class LapPhuongAnPhanBoDuToanChiNsnnChoDviModule {}
