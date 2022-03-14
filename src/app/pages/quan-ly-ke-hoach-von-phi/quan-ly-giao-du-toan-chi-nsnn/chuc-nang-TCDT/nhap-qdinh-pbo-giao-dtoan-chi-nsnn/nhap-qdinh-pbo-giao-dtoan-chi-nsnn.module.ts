import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhapQdinhPboGiaoDtoanChiNsnnComponent } from './nhap-qdinh-pbo-giao-dtoan-chi-nsnn.component';
import { NhapQdinhPboGiaoDtoanChiNsnnRoutingModule } from './nhap-qdinh-pbo-giao-dtoan-chi-nsnn-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    NhapQdinhPboGiaoDtoanChiNsnnComponent,
  ],
  imports: [
    CommonModule,
    NhapQdinhPboGiaoDtoanChiNsnnRoutingModule,
    ComponentsModule,
  ],
})

export class NhapQdinhPboGiaoDtoanChiNsnnModule {}
