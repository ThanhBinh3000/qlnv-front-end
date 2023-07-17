import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhapKhoComponent } from "./nhap-kho.component";
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { FormsModule } from "@angular/forms";
import { PhieuNhapKhoComponent } from './phieu-nhap-kho/phieu-nhap-kho.component';
import { BangKeCanHangComponent } from './bang-ke-can-hang/bang-ke-can-hang.component';
import { BienBanNhapDayKhoComponent } from './bien-ban-nhap-day-kho/bien-ban-nhap-day-kho.component';
import { NhapKhoMenuComponent } from './nhap-kho-menu/nhap-kho-menu.component';
import { PhieuNhapKhoTamGuiComponent } from './phieu-nhap-kho-tam-gui/phieu-nhap-kho-tam-gui.component';
import { BienBanGuiHangComponent } from './bien-ban-gui-hang/bien-ban-gui-hang.component';
import { BangKeNhapKhacNhapVatTuComponent } from './bang-ke-nhap-vat-tu/bang-ke-nhap-khac-nhap-vat-tu.component';
import { BienBanGiaoNhanComponent } from './bien-ban-giao-nhan/bien-ban-giao-nhan.component';
import { ThongTinPhieuNhapKhoComponent } from './phieu-nhap-kho/thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
import { ThongTinBangKeCanHangComponent } from './bang-ke-can-hang/thong-tin-bang-ke-can-hang/thong-tin-bang-ke-can-hang.component';
import { ThongTinBienBanNhapDayKhoComponent } from './bien-ban-nhap-day-kho/thong-tin-bien-ban-nhap-day-kho/thong-tin-bien-ban-nhap-day-kho.component';
import { ThongTinBangKeNhapKhacNhapVatTuComponent } from './bang-ke-nhap-vat-tu/thong-tin-bang-ke-nhap-khac-nhap-vat-tu/thong-tin-bang-ke-nhap-khac-nhap-vat-tu.component';
import { BienBanKetThucNhapKhacNhapKhoVatTuComponent } from './bien-ban-ket-thuc-nhap-kho/bien-ban-ket-thuc-nhap-khac-nhap-kho-vt.component';
import { ThongTinBienBanKetThucNhapKhacNhapKhoVatTuComponent } from './bien-ban-ket-thuc-nhap-kho/chi-tiet-bien-ban-ket-thuc-nhap-khac-nhap-kho-vt/chi-tiet-bien-ban-ket-thuc-nhap-khac-nhap-kho-vt.component';

@NgModule({
  declarations: [
    NhapKhoComponent,
    PhieuNhapKhoComponent,
    BangKeCanHangComponent,
    BienBanNhapDayKhoComponent,
    NhapKhoMenuComponent,
    PhieuNhapKhoTamGuiComponent,
    BienBanGuiHangComponent,
    BangKeNhapKhacNhapVatTuComponent,
    BienBanKetThucNhapKhacNhapKhoVatTuComponent,
    BienBanGiaoNhanComponent,
    ThongTinPhieuNhapKhoComponent,
    ThongTinBangKeCanHangComponent,
    ThongTinBienBanNhapDayKhoComponent,
    ThongTinBienBanKetThucNhapKhacNhapKhoVatTuComponent,
    ThongTinBangKeNhapKhacNhapVatTuComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    FormsModule,
  ],
  exports: [
    NhapKhoComponent
  ]
})
export class NhapKhoModule { }
