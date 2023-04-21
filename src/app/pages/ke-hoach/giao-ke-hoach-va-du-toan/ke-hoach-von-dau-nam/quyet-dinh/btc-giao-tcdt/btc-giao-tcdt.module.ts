
import { CommonModule } from '@angular/common';
import { BtcGiaoTcdtComponent } from './btc-giao-tcdt.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ThemQuyetDinhBtcGiaoTcdtComponent } from './them-quyet-dinh-btc-giao-tcdt/them-quyet-dinh-btc-giao-tcdt.component';
import { KeHoachMuaTangComponent } from './them-quyet-dinh-btc-giao-tcdt/ke-hoach-mua-tang/ke-hoach-mua-tang.component';
import { NgModule } from '@angular/core';
import { KeHoachNhapXuatLtComponent } from './them-quyet-dinh-btc-giao-tcdt/ke-hoach-nhap-xuat-lt/ke-hoach-nhap-xuat-lt.component';
import { ThemSuaMuaTangComponent } from './them-quyet-dinh-btc-giao-tcdt/ke-hoach-mua-tang/them-sua-mua-tang/them-sua-mua-tang.component';

@NgModule({
  declarations: [
    BtcGiaoTcdtComponent,
    ThemQuyetDinhBtcGiaoTcdtComponent,
    KeHoachMuaTangComponent,
    KeHoachNhapXuatLtComponent,
    ThemSuaMuaTangComponent
  ],
  imports: [CommonModule, ComponentsModule],
  exports: [BtcGiaoTcdtComponent],
})
export class BtcGiaoTcdtModule { }
