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
import { BaoCaoTuDonViCapDuoiComponent } from './bao-cao-tu-don-vi-cap-duoi/bao-cao-tu-don-vi-cap-duoi.component';
import { TongHopBaoCaoCapDuoiComponent } from './tong-hop-bao-cao-cap-duoi/tong-hop-bao-cao-cap-duoi.component';
import { DanhSachBaoCaoComponent } from './danh-sach-bao-cao/danh-sach-bao-cao.component';
import { DialogTongHopComponent } from './dialog-tong-hop/dialog-tong-hop.component';
import { BaoCaoTongHopComponent } from './bao-cao-tong-hop/bao-cao-tong-hop.component';
import { BaoCaoTuDonViCapDuoiModule } from './bao-cao-tu-don-vi-cap-duoi/bao-cao-tu-don-vi-cap-duoi.module';

@NgModule({
  declarations: [
    GiaoDuToanThucTeComponent,
    QuyetDinhBoTaiChinhComponent,
    TaoMoiQuyetDinhBtcComponent,
    PhanBoDuToanComponent,
    DialogTaoMoiComponent,
    DialogThemKhoanMucComponent,
    DialogThemThongTinQuyetToanComponent,
    DialogTongHopComponent,
    DanhSachDuToanGiaoTuCapTrenComponent,
    ChiTietDuToanTuCapTrenComponent,
    TaoMoiGiaoDieuChinhDuToanComponent,
    TaoMoiGiaoDuToanComponent,
    TongHopBaoCaoCapDuoiComponent,
    DanhSachBaoCaoComponent,
    BaoCaoTongHopComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    BaoCaoTuDonViCapDuoiModule
  ],
  exports: [
    GiaoDuToanThucTeComponent,
    QuyetDinhBoTaiChinhComponent,
    TaoMoiQuyetDinhBtcComponent,
    PhanBoDuToanComponent,
    DialogTaoMoiComponent,
    DialogThemKhoanMucComponent,
    DialogThemThongTinQuyetToanComponent,
    DialogTongHopComponent,
    DanhSachDuToanGiaoTuCapTrenComponent,
    ChiTietDuToanTuCapTrenComponent,
    TaoMoiGiaoDieuChinhDuToanComponent,
    TaoMoiGiaoDuToanComponent,
    TongHopBaoCaoCapDuoiComponent,
    DanhSachBaoCaoComponent,
    BaoCaoTongHopComponent
  ]

})
export class GiaoDuToanThucTeModule { }