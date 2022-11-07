import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DieuChinhDuToanComponent } from './dieu-chinh-du-toan.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TongHopBaoCaoComponent } from './tong-hop-bao-cao/tong-hop-bao-cao.component';
import { BaoCaoComponent } from './bao-cao/bao-cao.component';
import { BaoCaoTuDonViCapDuoiComponent } from './bao-cao-tu-don-vi-cap-duoi/bao-cao-tu-don-vi-cap-duoi.component';
import { DanhSachBaoCaoDieuChinhComponent } from './danh-sach-bao-cao-dieu-chinh/danh-sach-bao-cao-dieu-chinh.component';
import { DanhSachBaoCaoTuDonViCapDuoiComponent } from './danh-sach-bao-cao-tu-don-vi-cap-duoi/danh-sach-bao-cao-tu-don-vi-cap-duoi.component';
import { DialogTaoMoiComponent } from './dialog-tao-moi/dialog-tao-moi.component';
import { BaoCaoModule } from './bao-cao/bao-cao.module';

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
    BaoCaoTuDonViCapDuoiComponent,
    DanhSachBaoCaoDieuChinhComponent,
    DanhSachBaoCaoTuDonViCapDuoiComponent,
    DialogTaoMoiComponent,
  ],
  exports: [
    DieuChinhDuToanComponent,
    TongHopBaoCaoComponent,
    BaoCaoTuDonViCapDuoiComponent,
    DanhSachBaoCaoDieuChinhComponent,
    DanhSachBaoCaoTuDonViCapDuoiComponent,
    DialogTaoMoiComponent,
  ],
})
export class DieuChinhDuToanModule { }
