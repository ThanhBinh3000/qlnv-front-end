import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaoCaoTheoTtqdComponent} from './bao-cao-theo-ttqd.component';
import {ComponentsModule} from "../../../components/components.module";
import {MainModule} from "../../../layout/main/main.module";
import {NzTreeViewModule} from "ng-zorro-antd/tree-view";
import {BaoCaoTheoTtqdRoutingModule} from "./bao-cao-theo-ttqd-routing.module";
import {ThongTu1452013Component} from './thong-tu1452013/thong-tu1452013.component';
import {DirectivesModule} from "../../../directives/directives.module";
import {XuatRoutingModule} from "../../xuat/xuat-routing.module";
import {KhaiThacBaoCaoRoutingModule} from "../khai-thac-bao-cao-routing.module";


@NgModule({
  declarations: [
    BaoCaoTheoTtqdComponent,
    ThongTu1452013Component
  ],
  imports: [
    CommonModule,
    BaoCaoTheoTtqdRoutingModule,
    ComponentsModule,
    MainModule,
    NzTreeViewModule,
    DirectivesModule
  ]
})
export class BaoCaoTheoTtqdModule {
}
