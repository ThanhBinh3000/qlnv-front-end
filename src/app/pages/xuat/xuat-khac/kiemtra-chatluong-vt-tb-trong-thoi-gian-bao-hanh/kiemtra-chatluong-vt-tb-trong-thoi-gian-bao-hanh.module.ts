import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DirectivesModule} from "../../../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../../layout/main/main.module";
import {ComponentsModule} from "../../../../components/components.module";
import {CuuTroVienTroModule} from "../../xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.module";
import {
  KiemtraChatluongVtTbTrongThoiGianBaoHanhComponent
} from "./kiemtra-chatluong-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  KiemtraChatluongLtTruockhiHethanLuukhoModule
} from "../kiemtra-chatluong-lt-truockhi-hethan-luukho/kiemtra-chatluong-lt-truockhi-hethan-luukho.module";
import {
  ToanBoDsVtTbTrongThoiGianBaoHanhComponent
} from "./toan-bo-ds-vt-tb-trong-thoi-gian-bao-hanh/toan-bo-ds-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  TongHopDsVtTbTrongThoiGianBaoHanhComponent
} from "./tong-hop-ds-vt-tb-trong-thoi-gian-bao-hanh/tong-hop-ds-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  ChiTietTongHopDsVtTbTrongThoiGianBaoHanhComponent
} from "./tong-hop-ds-vt-tb-trong-thoi-gian-bao-hanh/chi-tiet-tong-hop-ds-hang-dtqg/chi-tiet-tong-hop-ds-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  QdGiaoNhiemVuXuatHangTrongThoiGianBaoHanhComponent
} from "./qd-giao-nhiem-vu-xuat-hang-trong-thoi-gian-bao-hanh/qd-giao-nhiem-vu-xuat-hang-trong-thoi-gian-bao-hanh.component";
import {
  ThongTinQdGiaoNhiemVuXuatHangTrongThoiGianBaoHanhComponent
} from "./qd-giao-nhiem-vu-xuat-hang-trong-thoi-gian-bao-hanh/thong-tin-qd-giao-nhiem-vu-xuat-hang-trong-thoi-gian-bao-hanh/thong-tin-qd-giao-nhiem-vu-xuat-hang-trong-thoi-gian-bao-hanh.component";
import {DieuChuyenNoiBoModule} from "../../../dieu-chuyen-noi-bo/dieu-chuyen-noi-bo.module";


@NgModule({
  declarations: [
    KiemtraChatluongVtTbTrongThoiGianBaoHanhComponent,
    ToanBoDsVtTbTrongThoiGianBaoHanhComponent,
    TongHopDsVtTbTrongThoiGianBaoHanhComponent,
    ChiTietTongHopDsVtTbTrongThoiGianBaoHanhComponent,
    QdGiaoNhiemVuXuatHangTrongThoiGianBaoHanhComponent,
    ThongTinQdGiaoNhiemVuXuatHangTrongThoiGianBaoHanhComponent

  ],
  imports: [
    CommonModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
    CuuTroVienTroModule,
    KiemtraChatluongLtTruockhiHethanLuukhoModule,
    DieuChuyenNoiBoModule,
  ],
  exports: [
    KiemtraChatluongVtTbTrongThoiGianBaoHanhComponent,
    ToanBoDsVtTbTrongThoiGianBaoHanhComponent,
    TongHopDsVtTbTrongThoiGianBaoHanhComponent,
    ChiTietTongHopDsVtTbTrongThoiGianBaoHanhComponent,
    QdGiaoNhiemVuXuatHangTrongThoiGianBaoHanhComponent,
    ThongTinQdGiaoNhiemVuXuatHangTrongThoiGianBaoHanhComponent
  ],
  providers: [DatePipe]
})
export class KiemtraChatluongVtTbTrongThbhComponentModule {
}
