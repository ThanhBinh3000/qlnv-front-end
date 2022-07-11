import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtcGiaoCacBoNganhComponent } from './btc-giao-cac-bo-nganh.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ThemQuyetDinhBtcGiaoCacBoNganhComponent } from './them-quyet-dinh-btc-giao-cac-bo-nganh/them-quyet-dinh-btc-giao-cac-bo-nganh.component';
import { KeHoachMuaTangComponent } from './them-quyet-dinh-btc-giao-cac-bo-nganh/ke-hoach-mua-tang/ke-hoach-mua-tang.component';
import { KeHoachXuatBanComponent } from './them-quyet-dinh-btc-giao-cac-bo-nganh/ke-hoach-xuat-ban/ke-hoach-xuat-ban.component';
import { KeHoachXuatGiamComponent } from './them-quyet-dinh-btc-giao-cac-bo-nganh/ke-hoach-xuat-giam/ke-hoach-xuat-giam.component';
import { KeHoachXuatLuanPhienDoiHangComponent } from './them-quyet-dinh-btc-giao-cac-bo-nganh/ke-hoach-xuat-luan-phien-doi-hang/ke-hoach-xuat-luan-phien-doi-hang.component';

@NgModule({
  declarations: [BtcGiaoCacBoNganhComponent, ThemQuyetDinhBtcGiaoCacBoNganhComponent, KeHoachMuaTangComponent, KeHoachXuatBanComponent, KeHoachXuatGiamComponent, KeHoachXuatLuanPhienDoiHangComponent],
  imports: [CommonModule, ComponentsModule],
  exports: [BtcGiaoCacBoNganhComponent],
})
export class BtcGiaoCacBoNganhModule {}
