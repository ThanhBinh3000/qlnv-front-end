import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { SubPhuongAnGiaComponent } from './sub-phuong-an-gia.component';
import { DeXuatPhuongAnGiaModule } from './de-xuat-phuong-an-gia/de-xuat-phuong-an-gia.module';
import { QuyetDinhGiaBtcModule } from './quyet-dinh-gia-btc/quyet-dinh-gia-btc.module';
import { TongHopPhuongAnGiaModule } from './tong-hop-phuong-an-gia/tong-hop-phuong-an-gia.module';
import { QuyetDinhGiaCuaTcdtnnModule } from './quyet-dinh-gia-cua-tcdtnn/quyet-dinh-gia-cua-tcdtnn.module';

@NgModule({
  declarations: [SubPhuongAnGiaComponent,],
  imports: [CommonModule,
    ComponentsModule,
    DeXuatPhuongAnGiaModule,
    QuyetDinhGiaBtcModule,
    TongHopPhuongAnGiaModule,
    QuyetDinhGiaCuaTcdtnnModule
  ],
  exports: [SubPhuongAnGiaComponent],
})
export class SubPhuongAnGiaModule { }
