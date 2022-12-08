import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BangKeNhapVatTuComponent } from './bang-ke-nhap-vat-tu/bang-ke-nhap-vat-tu.component';
import { ThongTinBangKeNhapVatTuComponent } from './bang-ke-nhap-vat-tu/thong-tin-bang-ke-nhap-vat-tu/thong-tin-bang-ke-nhap-vat-tu.component';
import { BienBanGiaoNhanComponent } from './bien-ban-giao-nhan/bien-ban-giao-nhan.component';
import { ThongTinBienBanGiaoNhanComponent } from './bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan.component';
import { BienBanGuiHangComponent } from './bien-ban-gui-hang/bien-ban-gui-hang.component';
import { ThongTinBienBanGuiHangComponent } from './bien-ban-gui-hang/thong-tin-bien-ban-gui-hang/thong-tin-bien-ban-gui-hang.component';
import { ChucNangNhapKhoComponent } from './chuc-nang-nhap-kho/chuc-nang-nhap-kho.component';
import { NhapKhoComponent } from './nhap-kho.component';
import { PhieuNhapKhoTamGuiComponent } from './phieu-nhap-kho-tam-gui/phieu-nhap-kho-tam-gui.component';
import { ThongTinPhieuNhapKhoTamGuiComponent } from './phieu-nhap-kho-tam-gui/thong-tin-phieu-nhap-kho-tam-gui/thong-tin-phieu-nhap-kho-tam-gui.component';
import { QuanLyBangKeCanHangComponent } from './quan-ly-bang-ke-can-hang/quan-ly-bang-ke-can-hang.component';
import { ThongTinQuanLyBangKeCanHangComponent } from './quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang.component';
import { QuanLyPhieuNhapDayKhoComponent } from './quan-ly-phieu-nhap-day-kho/quan-ly-phieu-nhap-day-kho.component';
import { ThemMoiPhieuNhapDayKhoComponent } from './quan-ly-phieu-nhap-day-kho/them-moi-phieu-nhap-day-kho/them-moi-phieu-nhap-day-kho.component';
import { QuanLyPhieuNhapKhoComponent } from './quan-ly-phieu-nhap-kho/quan-ly-phieu-nhap-kho.component';
import { ThemMoiPhieuNhapKhoComponent } from './quan-ly-phieu-nhap-kho/them-moi-phieu-nhap-kho/them-moi-phieu-nhap-kho.component';

@NgModule({
  declarations: [
    NhapKhoComponent,
    ChucNangNhapKhoComponent,
    QuanLyPhieuNhapDayKhoComponent,
    ThemMoiPhieuNhapDayKhoComponent,
    QuanLyPhieuNhapKhoComponent,
    ThemMoiPhieuNhapKhoComponent,
    QuanLyBangKeCanHangComponent,
    ThongTinQuanLyBangKeCanHangComponent,
    BangKeNhapVatTuComponent,
    ThongTinBangKeNhapVatTuComponent,
    BienBanGiaoNhanComponent,
    ThongTinBienBanGiaoNhanComponent,
    BienBanGuiHangComponent,
    ThongTinBienBanGuiHangComponent,
    PhieuNhapKhoTamGuiComponent,
    ThongTinPhieuNhapKhoTamGuiComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    NhapKhoComponent,
    ChucNangNhapKhoComponent,
    QuanLyPhieuNhapDayKhoComponent,
    QuanLyPhieuNhapKhoComponent,
    QuanLyBangKeCanHangComponent,
    BangKeNhapVatTuComponent,
    BienBanGiaoNhanComponent,
    BienBanGuiHangComponent,
    PhieuNhapKhoTamGuiComponent,
  ]
})
export class NhapKhoModule { }
