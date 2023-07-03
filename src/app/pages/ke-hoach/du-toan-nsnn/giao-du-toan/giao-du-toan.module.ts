import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { AddBaoCaoModule } from './add-bao-cao/add-bao-cao.module';
import { BaoCaoTuDonViCapDuoiModule } from './bao-cao-tu-don-vi-cap-duoi/bao-cao-tu-don-vi-cap-duoi.module';
import { ChiTietDuToanTuCapTrenComponent } from './chi-tiet-du-toan-tu-cap-tren/chi-tiet-du-toan-tu-cap-tren.component';
import { DanhSachBaoCaoComponent } from './danh-sach-bao-cao/danh-sach-bao-cao.component';
import { DanhSachDuToanGiaoTuCapTrenComponent } from './danh-sach-du-toan-giao-tu-cap-tren/danh-sach-du-toan-giao-tu-cap-tren.component';
import { DialogTaoMoiComponent } from './dialog-tao-moi/dialog-tao-moi.component';
import { DialogThemKhoanMucComponent } from './dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogThemThongTinQuyetToanComponent } from './dialog-them-thong-tin-quyet-toan/dialog-them-thong-tin-quyet-toan.component';
import { DialogTongHopComponent } from './dialog-tong-hop/dialog-tong-hop.component';
import { GiaoDuToanComponent } from './giao-du-toan.component';
import { PhanBoDuToanComponent } from './phan-bo-du-toan/phan-bo-du-toan.component';
import { QuyetDinhBoTaiChinhComponent } from './quyet-dinh-bo-tai-chinh/quyet-dinh-bo-tai-chinh.component';
import { TaoMoiGiaoDieuChinhDuToanComponent } from './tao-moi-giao-dieu-chinh-du-toan/tao-moi-giao-dieu-chinh-du-toan.component';
import { TaoMoiGiaoDuToanComponent } from './tao-moi-giao-du-toan/tao-moi-giao-du-toan.component';
import { TaoMoiQuyetDinhBtcComponent } from './tao-moi-quyet-dinh-btc/tao-moi-quyet-dinh-btc.component';
import { TongHopBaoCaoCapDuoiComponent } from './tong-hop-bao-cao-cap-duoi/tong-hop-bao-cao-cap-duoi.component';
import { DialogSelectTaiSanComponent } from './dialogSelectTaiSan/dialogSelectTaiSan.component';
import { AppComponent } from 'src/app/app.component';

@NgModule({
  declarations: [
    GiaoDuToanComponent,
    PhanBoDuToanComponent,
    QuyetDinhBoTaiChinhComponent,
    DialogTaoMoiComponent,
    TaoMoiQuyetDinhBtcComponent,
    TaoMoiGiaoDieuChinhDuToanComponent,
    TaoMoiGiaoDuToanComponent,
    DanhSachDuToanGiaoTuCapTrenComponent,
    DialogThemThongTinQuyetToanComponent,
    TongHopBaoCaoCapDuoiComponent,
    ChiTietDuToanTuCapTrenComponent,
    DialogTongHopComponent,
    DanhSachBaoCaoComponent,
    DialogThemKhoanMucComponent,
    DialogSelectTaiSanComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    BaoCaoTuDonViCapDuoiModule,
    AddBaoCaoModule,
  ],
  exports: [
    GiaoDuToanComponent,
    PhanBoDuToanComponent,
    QuyetDinhBoTaiChinhComponent,
    DialogTaoMoiComponent,
    TaoMoiQuyetDinhBtcComponent,
    TaoMoiGiaoDieuChinhDuToanComponent,
    TaoMoiGiaoDuToanComponent,
    DanhSachDuToanGiaoTuCapTrenComponent,
    DialogThemThongTinQuyetToanComponent,
    TongHopBaoCaoCapDuoiComponent,
    ChiTietDuToanTuCapTrenComponent,
    DialogTongHopComponent,
    DanhSachBaoCaoComponent,
    DialogThemKhoanMucComponent,
    DialogSelectTaiSanComponent,
  ],
  bootstrap: [AppComponent],
})
export class GiaoDuToanModule { }
