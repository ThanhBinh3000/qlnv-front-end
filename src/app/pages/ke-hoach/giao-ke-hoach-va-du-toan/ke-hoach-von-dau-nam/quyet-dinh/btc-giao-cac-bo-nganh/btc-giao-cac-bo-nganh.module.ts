import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { BtcGiaoCacBoNganhComponent } from './btc-giao-cac-bo-nganh.component';
import { ThemQuyetDinhBtcGiaoCacBoNganhModule } from './them-quyet-dinh-btc-giao-cac-bo-nganh/them-quyet-dinh-btc-giao-cac-bo-nganh.module';

@NgModule({
  declarations: [BtcGiaoCacBoNganhComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ThemQuyetDinhBtcGiaoCacBoNganhModule,
  ],
  exports: [BtcGiaoCacBoNganhComponent],
})
export class BtcGiaoCacBoNganhModule {}
