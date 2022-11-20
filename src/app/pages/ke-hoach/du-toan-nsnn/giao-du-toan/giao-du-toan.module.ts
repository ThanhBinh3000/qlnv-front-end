import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BaoCaoTuDonViCapDuoiModule } from './bao-cao-tu-don-vi-cap-duoi/bao-cao-tu-don-vi-cap-duoi.module';
import { DanhSachDuToanGiaoTuCapTrenComponent } from './danh-sach-du-toan-giao-tu-cap-tren/danh-sach-du-toan-giao-tu-cap-tren.component';
import { DialogTaoMoiComponent } from './dialog-tao-moi/dialog-tao-moi.component';
import { DuToanGiaoTuCapTrenComponent } from './du-toan-giao-tu-cap-tren/du-toan-giao-tu-cap-tren.component';
import { GiaoDuToanComponent } from './giao-du-toan.component';
import { PhanBoDuToanComponent } from './phan-bo-du-toan/phan-bo-du-toan.component';
import { QuyetDinhBoTaiChinhComponent } from './quyet-dinh-bo-tai-chinh/quyet-dinh-bo-tai-chinh.component';
import { TaoMoiGiaoDieuChinhDuToanComponent } from './tao-moi-giao-dieu-chinh-du-toan/tao-moi-giao-dieu-chinh-du-toan.component';
import { TaoMoiGiaoDuToanComponent } from './tao-moi-giao-du-toan/tao-moi-giao-du-toan.component';
import { TaoMoiQuyetDinhBtcComponent } from './tao-moi-quyet-dinh-btc/tao-moi-quyet-dinh-btc.component';

@NgModule({
  declarations: [
    GiaoDuToanComponent,
    DuToanGiaoTuCapTrenComponent,
    PhanBoDuToanComponent,
    QuyetDinhBoTaiChinhComponent,
    DialogTaoMoiComponent,
    TaoMoiQuyetDinhBtcComponent,
    TaoMoiGiaoDieuChinhDuToanComponent,
    TaoMoiGiaoDuToanComponent,
    DanhSachDuToanGiaoTuCapTrenComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    BaoCaoTuDonViCapDuoiModule,
  ],
  exports: [
    GiaoDuToanComponent,
    DuToanGiaoTuCapTrenComponent,
    PhanBoDuToanComponent,
    QuyetDinhBoTaiChinhComponent,
    DialogTaoMoiComponent,
    TaoMoiQuyetDinhBtcComponent,
    TaoMoiGiaoDieuChinhDuToanComponent,
    TaoMoiGiaoDuToanComponent,
    DanhSachDuToanGiaoTuCapTrenComponent
  ],
})
export class GiaoDuToanModule { }
