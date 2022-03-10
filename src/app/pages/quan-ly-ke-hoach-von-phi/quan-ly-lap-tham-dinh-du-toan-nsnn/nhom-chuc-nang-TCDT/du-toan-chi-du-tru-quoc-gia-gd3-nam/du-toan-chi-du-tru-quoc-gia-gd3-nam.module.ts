import { DuToanChiDuTruQuocGiaGd3NamComponent } from './du-toan-chi-du-tru-quoc-gia-gd3-nam.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DuToanChiDuTruQuocGiaGd3NamRoutingModule } from './du-toan-chi-du-tru-quoc-gia-gd3-nam-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DuToanChiDuTruQuocGiaGd3NamComponent,
  ],
  imports: [
    CommonModule,
    DuToanChiDuTruQuocGiaGd3NamRoutingModule,
    ComponentsModule,
  ],
})

export class DuToanChiDuTruQuocGiaGd3NamModule {}
