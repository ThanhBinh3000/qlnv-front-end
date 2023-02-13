import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiaoDuToanThucTeComponent } from './giao-du-toan-thuc-te.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { QuyetDinhBoTaiChinhComponent } from './quyet-dinh-bo-tai-chinh/quyet-dinh-bo-tai-chinh.component';
import { TaoMoiQuyetDinhBtcComponent } from './tao-moi-quyet-dinh-btc/tao-moi-quyet-dinh-btc.component';
import { PhanBoDuToanComponent } from './phan-bo-du-toan/phan-bo-du-toan.component';
import { DialogTaoMoiComponent } from './dialog-tao-moi/dialog-tao-moi.component';
import { DialogThemKhoanMucComponent } from './dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DanhSachDuToanGiaoTuCapTrenComponent } from './danh-sach-du-toan-giao-tu-cap-tren/danh-sach-du-toan-giao-tu-cap-tren.component';
import { DialogThemThongTinQuyetToanComponent } from './dialog-them-thong-tin-quyet-toan/dialog-them-thong-tin-quyet-toan.component';
import { ChiTietDuToanTuCapTrenComponent } from './chi-tiet-du-toan-tu-cap-tren/chi-tiet-du-toan-tu-cap-tren.component';
import { TaoMoiGiaoDieuChinhDuToanComponent } from './tao-moi-giao-dieu-chinh-du-toan/tao-moi-giao-dieu-chinh-du-toan.component';
import { TaoMoiGiaoDuToanComponent } from './tao-moi-giao-du-toan/tao-moi-giao-du-toan.component';

@NgModule({
  declarations: [
    GiaoDuToanThucTeComponent,
    QuyetDinhBoTaiChinhComponent,
    TaoMoiQuyetDinhBtcComponent,
    PhanBoDuToanComponent,
    DialogTaoMoiComponent,
    DialogThemKhoanMucComponent,
    DialogThemThongTinQuyetToanComponent,
    DanhSachDuToanGiaoTuCapTrenComponent,
    ChiTietDuToanTuCapTrenComponent,
    TaoMoiGiaoDieuChinhDuToanComponent,
    TaoMoiGiaoDuToanComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    GiaoDuToanThucTeComponent,
    QuyetDinhBoTaiChinhComponent,
    TaoMoiQuyetDinhBtcComponent,
    PhanBoDuToanComponent,
    DialogTaoMoiComponent,
    DialogThemKhoanMucComponent,
    DialogThemThongTinQuyetToanComponent,
    DanhSachDuToanGiaoTuCapTrenComponent,
    ChiTietDuToanTuCapTrenComponent,
    TaoMoiGiaoDieuChinhDuToanComponent,
    TaoMoiGiaoDuToanComponent,
  ]

})
export class GiaoDuToanThucTeModule { }