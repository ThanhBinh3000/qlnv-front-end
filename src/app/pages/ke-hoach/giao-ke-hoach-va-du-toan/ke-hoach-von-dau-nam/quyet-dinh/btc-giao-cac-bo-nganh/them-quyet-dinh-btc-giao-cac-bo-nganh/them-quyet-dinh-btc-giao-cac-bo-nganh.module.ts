import { NgModule } from '@angular/core';
import { ThemQuyetDinhBtcGiaoCacBoNganhComponent } from './them-quyet-dinh-btc-giao-cac-bo-nganh.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { CommonModule } from '@angular/common';
import { KeHoachMuaTangComponent } from './ke-hoach-mua-tang/ke-hoach-mua-tang.component';
import { KeHoachXuatBanComponent } from './ke-hoach-xuat-ban/ke-hoach-xuat-ban.component';
import { KeHoachXuatGiamComponent } from './ke-hoach-xuat-giam/ke-hoach-xuat-giam.component';
import { KeHoachXuatLuanPhienDoiHangComponent } from './ke-hoach-xuat-luan-phien-doi-hang/ke-hoach-xuat-luan-phien-doi-hang.component';
@NgModule({
  declarations: [
    ThemQuyetDinhBtcGiaoCacBoNganhComponent,
    KeHoachMuaTangComponent,
    KeHoachXuatBanComponent,
    KeHoachXuatGiamComponent,
    KeHoachXuatLuanPhienDoiHangComponent,
  ],
  imports: [CommonModule, ComponentsModule],
  exports: [ThemQuyetDinhBtcGiaoCacBoNganhComponent],
})
export class ThemQuyetDinhBtcGiaoCacBoNganhModule {}
