import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemQuyetDinhBtcGiaoTcdtComponent } from './them-quyet-dinh-btc-giao-tcdt.component';
import { KeHoachXuatLuanPhienDoiHangComponent } from './ke-hoach-xuat-luan-phien-doi-hang/ke-hoach-xuat-luan-phien-doi-hang.component';
import { KeHoachMuaTangComponent } from './ke-hoach-mua-tang/ke-hoach-mua-tang.component';
import { KeHoachXuatGiamComponent } from './ke-hoach-xuat-giam/ke-hoach-xuat-giam.component';
import { KeHoachXuatBanComponent } from './ke-hoach-xuat-ban/ke-hoach-xuat-ban.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    ThemQuyetDinhBtcGiaoTcdtComponent,
    KeHoachXuatLuanPhienDoiHangComponent,
    KeHoachMuaTangComponent,
    KeHoachXuatGiamComponent,
    KeHoachXuatBanComponent,
  ],
  imports: [CommonModule, ComponentsModule],
  exports: [ThemQuyetDinhBtcGiaoTcdtComponent],
})
export class ThemQuyetDinhBtcGiaoTcdtModule {}
