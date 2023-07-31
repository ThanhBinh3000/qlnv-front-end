import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HangTrongKhoRoutingModule } from './hang-trong-kho-routing.module';
import { HangTrongKhoComponent } from './hang-trong-kho.component';
import {ComponentsModule} from "../../../components/components.module";
import { TatCaComponent } from './tat-ca/tat-ca.component';
import { TableDanhMucBpxlComponent } from './table-danh-muc-bpxl/table-danh-muc-bpxl.component';
import { TableSapHhBhComponent } from './table-sap-hh-bh/table-sap-hh-bh.component';
import { TableHhLkComponent } from './table-hh-lk/table-hh-lk.component';
import { TableDaHhBhComponent } from './table-da-hh-bh/table-da-hh-bh.component';


@NgModule({
  declarations: [
    HangTrongKhoComponent,
    TatCaComponent,
    TableDanhMucBpxlComponent,
    TableSapHhBhComponent,
    TableHhLkComponent,
    TableDaHhBhComponent
  ],
  imports: [
    CommonModule,
    HangTrongKhoRoutingModule,
    ComponentsModule
  ]
})
export class HangTrongKhoModule { }
