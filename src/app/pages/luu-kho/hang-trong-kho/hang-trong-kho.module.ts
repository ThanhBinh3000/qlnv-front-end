import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HangTrongKhoRoutingModule } from './hang-trong-kho-routing.module';
import { HangTrongKhoComponent } from './hang-trong-kho.component';
import {ComponentsModule} from "../../../components/components.module";
import { TatCaComponent } from './tat-ca/tat-ca.component';
import { TableDanhMucBpxlComponent } from './table-danh-muc-bpxl/table-danh-muc-bpxl.component';



@NgModule({
  declarations: [
    HangTrongKhoComponent,
    TatCaComponent,
    TableDanhMucBpxlComponent,
  ],
  imports: [
    CommonModule,
    HangTrongKhoRoutingModule,
    ComponentsModule
  ]
})
export class HangTrongKhoModule { }
