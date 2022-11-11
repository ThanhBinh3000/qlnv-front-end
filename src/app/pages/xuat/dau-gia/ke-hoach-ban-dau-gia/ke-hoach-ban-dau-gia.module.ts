import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeXuatComponent } from './de-xuat/de-xuat.component';
import { TongHopComponent } from './tong-hop/tong-hop.component';
import { QuyetDinhComponent } from './quyet-dinh/quyet-dinh.component';



@NgModule({
  declarations: [
    DeXuatComponent,
    TongHopComponent,
    QuyetDinhComponent
  ],
  exports: [
    DeXuatComponent
  ],
  imports: [
    CommonModule
  ]
})
export class KeHoachBanDauGiaModule { }
