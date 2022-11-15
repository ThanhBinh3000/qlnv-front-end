import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeXuatComponent } from './de-xuat/de-xuat.component';
import { TongHopComponent } from './tong-hop/tong-hop.component';
import { QuyetDinhComponent } from './quyet-dinh/quyet-dinh.component';
import { MainKeHoachBanDauGiaComponent } from './main-ke-hoach-ban-dau-gia/main-ke-hoach-ban-dau-gia.component';
import {ComponentsModule} from "../../../../components/components.module";
import {MainModule} from "../../../../layout/main/main.module";
import { ThemDeXuatKeHoachBanDauGiaComponent } from './de-xuat/them-de-xuat-ke-hoach-ban-dau-gia/them-de-xuat-ke-hoach-ban-dau-gia.component';



@NgModule({
  declarations: [
    DeXuatComponent,
    TongHopComponent,
    QuyetDinhComponent,
    MainKeHoachBanDauGiaComponent,
    ThemDeXuatKeHoachBanDauGiaComponent
  ],
  exports: [
    DeXuatComponent,
    MainKeHoachBanDauGiaComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule
  ]
})
export class KeHoachBanDauGiaModule { }
