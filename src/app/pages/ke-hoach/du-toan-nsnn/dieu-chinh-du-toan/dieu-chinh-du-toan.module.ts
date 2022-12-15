import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BaoCaoModule } from './bao-cao/bao-cao.module';
import { DanhSachBaoCaoDieuChinhComponent } from './danh-sach-bao-cao-dieu-chinh/danh-sach-bao-cao-dieu-chinh.component';
import { DanhSachBaoCaoTuDonViCapDuoiComponent } from './danh-sach-bao-cao-tu-don-vi-cap-duoi/danh-sach-bao-cao-tu-don-vi-cap-duoi.component';
import { DialogTaoMoiComponent } from './dialog-tao-moi/dialog-tao-moi.component';
import { DialogThemKhoanMucComponent } from './dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DieuChinhDuToanComponent } from './dieu-chinh-du-toan.component';
import { TongHopBaoCaoComponent } from './tong-hop-bao-cao/tong-hop-bao-cao.component';

@NgModule({
  imports: [
    BaoCaoModule,
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  declarations: [
    DieuChinhDuToanComponent,
    TongHopBaoCaoComponent,
    DanhSachBaoCaoDieuChinhComponent,
    DanhSachBaoCaoTuDonViCapDuoiComponent,
    DialogTaoMoiComponent,
    DialogThemKhoanMucComponent
  ],
  exports: [
    DieuChinhDuToanComponent,
    TongHopBaoCaoComponent,
    DanhSachBaoCaoDieuChinhComponent,
    DanhSachBaoCaoTuDonViCapDuoiComponent,
    DialogTaoMoiComponent,
    DialogThemKhoanMucComponent
  ],
})
export class DieuChinhDuToanModule { }
