import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToanBoDanhSachVt6ThComponent } from './toan-bo-danh-sach-vt6th/toan-bo-danh-sach-vt6th.component';
import { QuyetDinhGiaoNhiemVuXuatHangComponent } from './quyet-dinh-giao-nhiem-vu-xuat-hang/quyet-dinh-giao-nhiem-vu-xuat-hang.component';
import { QuyetDinhXuatGiamVatTuComponent } from './quyet-dinh-xuat-giam-vat-tu/quyet-dinh-xuat-giam-vat-tu.component';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong/kiem-tra-chat-luong.component';
import { XuatKhoComponent } from './xuat-kho/xuat-kho.component';
import { NhapKhoComponent } from './nhap-kho/nhap-kho.component';
import {DirectivesModule} from "../../../../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../../../layout/main/main.module";
import {ComponentsModule} from "../../../../../components/components.module";



@NgModule({
  declarations: [
    ToanBoDanhSachVt6ThComponent,
    QuyetDinhGiaoNhiemVuXuatHangComponent,
    QuyetDinhXuatGiamVatTuComponent,
    KiemTraChatLuongComponent,
    XuatKhoComponent,
    NhapKhoComponent
  ],
  exports: [
    ToanBoDanhSachVt6ThComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
  ]
})
export class VtTbCoThoihanLuukhoConSauThangModule { }
