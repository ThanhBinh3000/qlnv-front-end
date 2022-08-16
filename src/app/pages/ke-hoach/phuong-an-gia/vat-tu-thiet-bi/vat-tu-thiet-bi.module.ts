import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { VatTuThietBiComponent } from './vat-tu-thiet-bi.component';
import { QuyetDinhGiaCdtnnModule } from './quyet-dinh-gia-cdtnn/quyet-dinh-gia-cdtnn.module';
import { DeXuatPhuongAnGiaModule } from './de-xuat-phuong-an-gia/de-xuat-phuong-an-gia.module';
import { QuyetDinhGiaBtcModule } from './quyet-dinh-gia-btc/quyet-dinh-gia-btc.module';
import { QuyetDinhDieuChinhCdtnnModule } from './quyet-dinh-dieu-chinh-cdtnn/quyet-dinh-dieu-chinh-cdtnn.module';

@NgModule({
  declarations: [VatTuThietBiComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    DeXuatPhuongAnGiaModule,
    QuyetDinhGiaCdtnnModule,
    QuyetDinhGiaBtcModule,
    QuyetDinhDieuChinhCdtnnModule
  ],
  exports: [
    VatTuThietBiComponent,
  ]
})
export class VatTuThietBiModule { }
