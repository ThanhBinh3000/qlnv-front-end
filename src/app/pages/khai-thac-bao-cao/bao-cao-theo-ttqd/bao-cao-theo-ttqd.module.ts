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
import { KhTongHopNhapXuatComponent } from './kh-tong-hop-nhap-xuat/kh-tong-hop-nhap-xuat.component';
import { NzIconModule } from "ng-zorro-antd/icon";
import { KhTangHangDtqgComponent } from './kh-tang-hang-dtqg/kh-tang-hang-dtqg.component';
import { KhGiamHangDtqgComponent } from './kh-giam-hang-dtqg/kh-giam-hang-dtqg.component';


@NgModule({
  declarations: [
    BaoCaoTheoTtqdComponent,
    ThongTu1452013Component,
    KhTongHopNhapXuatComponent,
    KhTangHangDtqgComponent,
    KhGiamHangDtqgComponent
  ],
  imports: [
    CommonModule,
    BaoCaoTheoTtqdRoutingModule,
    ComponentsModule,
    MainModule,
    NzTreeViewModule,
    DirectivesModule,
    NzIconModule,
  ]
})
export class BaoCaoTheoTtqdModule {
}
