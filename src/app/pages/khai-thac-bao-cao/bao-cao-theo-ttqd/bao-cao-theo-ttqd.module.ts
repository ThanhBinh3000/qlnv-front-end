import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BaoCaoTheoTtqdComponent } from "./bao-cao-theo-ttqd.component";
import { ComponentsModule } from "../../../components/components.module";
import { MainModule } from "../../../layout/main/main.module";
import { NzTreeViewModule } from "ng-zorro-antd/tree-view";
import { BaoCaoTheoTtqdRoutingModule } from "./bao-cao-theo-ttqd-routing.module";
import { ThongTu1452013Component } from "./thong-tu1452013/thong-tu1452013.component";
import { DirectivesModule } from "../../../directives/directives.module";
import { KhTongHopNhapXuatComponent } from "./kh-tong-hop-nhap-xuat/kh-tong-hop-nhap-xuat.component";
import { NzIconModule } from "ng-zorro-antd/icon";
import { KhTangHangDtqgComponent } from './kh-tang-hang-dtqg/kh-tang-hang-dtqg.component';
import { KhGiamHangDtqgComponent } from './kh-giam-hang-dtqg/kh-giam-hang-dtqg.component';
import {CtNhapXuatTonKhoHangDtqgComponent} from "./ct-nhap-xuat-ton-kho-hang-dtqg/ct-nhap-xuat-ton-kho-hang-dtqg.component";
import {
  TinhHinhThPhiBqHangDtqgTheoDinhMucComponent
} from "./tinh-hinh-th-phi-bq-hang-dtqg-theo-dinh-muc/tinh-hinh-th-phi-bq-hang-dtqg-theo-dinh-muc.component";
import {
  ThPhiNhapXuatPhiXuatVienTroCuuHoHtHangDtqgComponent
} from "./th-phi-nhap-xuat-phi-xuat-vien-tro-cuu-ho-ht-hang-dtqg/th-phi-nhap-xuat-phi-xuat-vien-tro-cuu-ho-ht-hang-dtqg.component";
import { KhLuanPhienDoiHangComponent } from "./kh-luan-phien-doi-hang/kh-luan-phien-doi-hang.component";
import {
  ThucHienKhNhapXuatCtvtBaoQuanComponent
} from "./thuc-hien-kh-nhap-xuat-ctvt-bao-quan/thuc-hien-kh-nhap-xuat-ctvt-bao-quan.component";
import {NguonHinhThanhDtqgComponent} from "./nguon-hinh-thanh-dtqg/nguon-hinh-thanh-dtqg.component";
import {
  TongChiChoMuaHangDtqgTrongKyComponent
} from "./tong-chi-cho-mua-hang-dtqg-trong-ky/tong-chi-cho-mua-hang-dtqg-trong-ky.component";
import {KhMuaHangDtqgComponent} from "./kh-mua-hang-dtqg/kh-mua-hang-dtqg.component";
import {SlGiaTriHangDtqgComponent} from "./sl-gia-tri-hang-dtqg/sl-gia-tri-hang-dtqg.component";
import {
  SlGiaTriHangDtqgNhapTrongKyComponent
} from "./sl-gia-tri-hang-dtqg-nhap-trong-ky/sl-gia-tri-hang-dtqg-nhap-trong-ky.component";
import {
  SlGiaTriHangDtqgXuatTrongKyComponent
} from "./sl-gia-tri-hang-dtqg-xuat-trong-ky/sl-gia-tri-hang-dtqg-xuat-trong-ky.component";
import {
  SlGiaTriHangDtqgXuatCapKhongThuTienTrongKyComponent
} from "./sl-gia-tri-hang-dtqg-xuat-cap-khong-thu-tien-trong-ky/sl-gia-tri-hang-dtqg-xuat-cap-khong-thu-tien-trong-ky.component";
import {
  SlGiaTriHangDtqgXuatCapCtHtPvqpAnNinhNvKhacTrongKyComponent
} from "./sl-gia-tri-hang-dtqg-xuat-cap-ct-ht-pvqp-an-ninh-nv-khac-trong-ky/sl-gia-tri-hang-dtqg-xuat-cap-ct-ht-pvqp-an-ninh-nv-khac-trong-ky.component";
import {
  SlGiaTriHangDtqgXuatVienTroTrongKyComponent
} from "./sl-gia-tri-hang-dtqg-xuat-vien-tro-trong-ky/sl-gia-tri-hang-dtqg-xuat-vien-tro-trong-ky.component";
import {
  TnSdHangDtqgXuatCtQpAnNhiemVuKhacDuocGiaoTrongKyComponent
} from "./tn-sd-hang-dtqg-xuat-ct-qp-an-nhiem-vu-khac-duoc-giao-trong-ky/tn-sd-hang-dtqg-xuat-ct-qp-an-nhiem-vu-khac-duoc-giao-trong-ky.component";
import {
  CtNhapXuatTonKhoHangDtqgTt108Component
} from "./ct-nhap-xuat-ton-kho-hang-dtqg-tt-108/ct-nhap-xuat-ton-kho-hang-dtqg-tt-108.component";


@NgModule({
  declarations: [
    BaoCaoTheoTtqdComponent,
    ThongTu1452013Component,
    KhTongHopNhapXuatComponent,
    KhTangHangDtqgComponent,
    KhGiamHangDtqgComponent,
    CtNhapXuatTonKhoHangDtqgComponent,
    TinhHinhThPhiBqHangDtqgTheoDinhMucComponent,
    ThPhiNhapXuatPhiXuatVienTroCuuHoHtHangDtqgComponent,
    KhLuanPhienDoiHangComponent,
    ThucHienKhNhapXuatCtvtBaoQuanComponent,
    NguonHinhThanhDtqgComponent,
    TongChiChoMuaHangDtqgTrongKyComponent,
    KhMuaHangDtqgComponent,
    SlGiaTriHangDtqgComponent,
    SlGiaTriHangDtqgNhapTrongKyComponent,
    SlGiaTriHangDtqgXuatTrongKyComponent,
    SlGiaTriHangDtqgXuatCapKhongThuTienTrongKyComponent,
    SlGiaTriHangDtqgXuatCapCtHtPvqpAnNinhNvKhacTrongKyComponent,
    SlGiaTriHangDtqgXuatVienTroTrongKyComponent,
    TnSdHangDtqgXuatCtQpAnNhiemVuKhacDuocGiaoTrongKyComponent,
    CtNhapXuatTonKhoHangDtqgTt108Component
  ],
  imports: [
    CommonModule,
    BaoCaoTheoTtqdRoutingModule,
    ComponentsModule,
    MainModule,
    NzTreeViewModule,
    DirectivesModule,
    NzIconModule
  ]
})
export class BaoCaoTheoTtqdModule {
}
