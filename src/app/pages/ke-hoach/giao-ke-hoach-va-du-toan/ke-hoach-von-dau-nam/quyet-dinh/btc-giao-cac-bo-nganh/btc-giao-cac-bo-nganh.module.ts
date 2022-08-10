import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { BtcGiaoCacBoNganhComponent } from './btc-giao-cac-bo-nganh.component';
import { KeHoachMuaTangComponent } from './them-quyet-dinh-btc-giao-cac-bo-nganh/ke-hoach-mua-tang/ke-hoach-mua-tang.component';
import { ThemQuyetDinhBtcGiaoCacBoNganhComponent } from './them-quyet-dinh-btc-giao-cac-bo-nganh/them-quyet-dinh-btc-giao-cac-bo-nganh.component';
@NgModule({
  declarations: [
    BtcGiaoCacBoNganhComponent,
    ThemQuyetDinhBtcGiaoCacBoNganhComponent,
    KeHoachMuaTangComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
  ],
  exports: [
    BtcGiaoCacBoNganhComponent
  ],
})
export class BtcGiaoCacBoNganhModule { }
