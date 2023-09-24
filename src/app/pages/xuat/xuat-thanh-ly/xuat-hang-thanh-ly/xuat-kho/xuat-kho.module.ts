import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XuatKhoRoutingModule } from './xuat-kho-routing.module';
import { XuatKhoComponent } from './xuat-kho.component';
import {ComponentsModule} from "../../../../../components/components.module";


@NgModule({
  declarations: [
    XuatKhoComponent
  ],
  imports: [
    CommonModule,
    XuatKhoRoutingModule,
    ComponentsModule
  ]
})
export class XuatKhoModule { }
