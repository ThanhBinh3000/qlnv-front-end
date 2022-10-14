import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {KhaiThacBaoCaoRoutingModule} from './khai-thac-bao-cao-routing.module';
import {KhaiThacBaoCaoComponent} from './khai-thac-bao-cao.component';
import {ComponentsModule} from "../../components/components.module";
import {MainModule} from "../../layout/main/main.module";
import {XuatRoutingModule} from "../xuat/xuat-routing.module";


@NgModule({
  declarations: [
    KhaiThacBaoCaoComponent
  ],
  imports: [
    CommonModule,
    KhaiThacBaoCaoRoutingModule,
    ComponentsModule,
    MainModule
  ]
})
export class KhaiThacBaoCaoModule {
}
