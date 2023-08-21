import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NzMenuModule} from "ng-zorro-antd/menu";
import {ComponentsModule} from "../../../../components/components.module";
import {ToanBoDanhSachHangBkkComponent} from "./toan-bo-danh-sach/toan-bo-danh-sach-hang-bkk.component";
import {
  TongHopDanhSachHangBkkComponent
} from "./tong-hop-danh-sach/tong-hop-danh-sach-hang-bkk.component";
import {
  ChiTietTongHopDanhSachHangBkkComponent
} from "./tong-hop-danh-sach/chi-tiet-tong-hop-danh-sach/chi-tiet-tong-hop-danh-sach-hang-bkk.component";


@NgModule({
  declarations: [ToanBoDanhSachHangBkkComponent, TongHopDanhSachHangBkkComponent, ChiTietTongHopDanhSachHangBkkComponent],
  imports: [
    CommonModule,
    NzMenuModule,
    ComponentsModule,
  ],
  exports: [
    ToanBoDanhSachHangBkkComponent, TongHopDanhSachHangBkkComponent, ChiTietTongHopDanhSachHangBkkComponent
  ],
  providers: [DatePipe]
})
export class XuatHangDtqgThBkkModule {
}
