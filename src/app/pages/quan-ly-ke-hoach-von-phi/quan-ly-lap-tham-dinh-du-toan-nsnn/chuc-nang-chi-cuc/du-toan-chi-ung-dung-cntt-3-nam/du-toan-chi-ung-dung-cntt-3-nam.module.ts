import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DuToanChiUngDungCntt3NamRoutingModule } from './du-toan-chi-ung-dung-cntt-3-nam-routing.module';
import { DuToanChiUngDungCntt3NamComponent } from './du-toan-chi-ung-dung-cntt-3-nam.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DuToanChiUngDungCntt3NamComponent,
  ],
  imports: [
    CommonModule,
    DuToanChiUngDungCntt3NamRoutingModule,
    ComponentsModule,
  ],
})

export class DuToanChiUngDungCntt3NamModule {}
