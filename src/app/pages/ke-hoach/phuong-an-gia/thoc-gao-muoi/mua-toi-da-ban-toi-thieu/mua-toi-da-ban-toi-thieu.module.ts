import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { MuaToiDaBanToiThieuComponent } from './mua-toi-da-ban-toi-thieu.component';
import { DeXuatPhuongAnGiaComponent } from './de-xuat-phuong-an-gia/de-xuat-phuong-an-gia.component';
import { DeXuatPhuongAnGiaModule } from './de-xuat-phuong-an-gia/de-xuat-phuong-an-gia.module';
import { QuyetDinhGiaBtcComponent } from './quyet-dinh-gia-btc/quyet-dinh-gia-btc.component';
import { QuyetDinhGiaBtcModule } from './quyet-dinh-gia-btc/quyet-dinh-gia-btc.module';

@NgModule({
  declarations: [MuaToiDaBanToiThieuComponent],
  imports: [CommonModule,
    ComponentsModule,
    DeXuatPhuongAnGiaModule,
    QuyetDinhGiaBtcModule
  ],
  exports: [MuaToiDaBanToiThieuComponent],
})
export class MuaToiDaBanToiThieuModule { }
