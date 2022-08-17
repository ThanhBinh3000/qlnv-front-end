import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { GiaCuTheComponent } from './gia-cu-the.component';
import { DeXuatPhuongAnGiaHaiComponent } from './de-xuat-phuong-an-gia-hai/de-xuat-phuong-an-gia-hai.component';
import { DeXuatPhuongAnGiaHaiModule } from './de-xuat-phuong-an-gia-hai/de-xuat-phuong-an-gia-hai.module';
import { TongHopPhuongAnGiaHaiComponent } from './tong-hop-phuong-an-gia-hai/tong-hop-phuong-an-gia-hai.component';
import { TongHopPhuongAnGiaHaiModule } from './tong-hop-phuong-an-gia-hai/tong-hop-phuong-an-gia-hai.module';
import { QuyetDinhGiaCuaTcdtnnComponent } from './quyet-dinh-gia-cua-tcdtnn/quyet-dinh-gia-cua-tcdtnn.component';
import { QuyetDinhGiaCuaTcdtnnModule } from './quyet-dinh-gia-cua-tcdtnn/quyet-dinh-gia-cua-tcdtnn.module';
import { QuyetDinhDieuChinhGiaCuaTcdtnnComponent } from './quyet-dinh-dieu-chinh-gia-cua-tcdtnn/quyet-dinh-dieu-chinh-gia-cua-tcdtnn.component';
import { QuyetDinhDieuChinhGiaCuaTcdtnnModule } from './quyet-dinh-dieu-chinh-gia-cua-tcdtnn/quyet-dinh-dieu-chinh-gia-cua-tcdtnn.module';

@NgModule({
  declarations: [GiaCuTheComponent,],
  imports: [CommonModule, ComponentsModule,
    DeXuatPhuongAnGiaHaiModule,
    TongHopPhuongAnGiaHaiModule,
    QuyetDinhGiaCuaTcdtnnModule,
    QuyetDinhDieuChinhGiaCuaTcdtnnModule],
  exports: [GiaCuTheComponent],
})
export class GiaCuTheModule { }
