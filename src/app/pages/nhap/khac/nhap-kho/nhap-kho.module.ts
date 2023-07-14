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
import { BangKeNhapVatTuComponent } from './bang-ke-nhap-vat-tu/bang-ke-nhap-vat-tu.component';
import { BienBanKetThucNhapKhoComponent } from './bien-ban-ket-thuc-nhap-kho/bien-ban-ket-thuc-nhap-kho.component';
import { BienBanGiaoNhanComponent } from './bien-ban-giao-nhan/bien-ban-giao-nhan.component';
import { ThongTinPhieuNhapKhoComponent } from './phieu-nhap-kho/thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
import { ThongTinBangKeCanHangComponent } from './bang-ke-can-hang/thong-tin-bang-ke-can-hang/thong-tin-bang-ke-can-hang.component';
import { ThongTinBienBanNhapDayKhoComponent } from './bien-ban-nhap-day-kho/thong-tin-bien-ban-nhap-day-kho/thong-tin-bien-ban-nhap-day-kho.component';
import { ThongTinBienBanKetThucNhapKhoComponent } from './bien-ban-ket-thuc-nhap-kho/chi-tiet-bien-ban-ket-thuc-nhap-day-kho/chi-tiet-bien-ban-ket-thuc-nhap-kho.component';
import { ThongTinBienBanGiaoNhanComponent } from './bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan.component';



@NgModule({
  declarations: [
    NhapKhoComponent,
    PhieuNhapKhoComponent,
    BangKeCanHangComponent,
    BienBanNhapDayKhoComponent,
    NhapKhoMenuComponent,
    PhieuNhapKhoTamGuiComponent,
    BienBanGuiHangComponent,
    BangKeNhapVatTuComponent,
    BienBanKetThucNhapKhoComponent,
    BienBanGiaoNhanComponent,
    ThongTinPhieuNhapKhoComponent,
    ThongTinBangKeCanHangComponent,
    ThongTinBienBanNhapDayKhoComponent,
    ThongTinBienBanKetThucNhapKhoComponent,
    ThongTinBienBanGiaoNhanComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    FormsModule,
  ],
    exports: [
        NhapKhoComponent,
        ThongTinPhieuNhapKhoComponent
    ]
})
export class NhapKhoModule { }
