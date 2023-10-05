import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QdDieuchinhKhbdgComponent } from './qd-dieuchinh-khbdg/qd-dieuchinh-khbdg.component';
import { ChitietQdDieuchinhHkbdgComponent } from './qd-dieuchinh-khbdg/chitiet-qd-dieuchinh-hkbdg/chitiet-qd-dieuchinh-hkbdg.component';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { ThongtinQdDieuchinhKhbdgComponent } from './qd-dieuchinh-khbdg/chitiet-qd-dieuchinh-hkbdg/thongtin-qd-dieuchinh-khbdg/thongtin-qd-dieuchinh-khbdg.component';
import { KeHoachBanDauGiaModule } from '../ke-hoach-ban-dau-gia/ke-hoach-ban-dau-gia.module';



@NgModule({
  declarations: [
    QdDieuchinhKhbdgComponent,
    ChitietQdDieuchinhHkbdgComponent,
    ThongtinQdDieuchinhKhbdgComponent,
  ],
  exports: [
    QdDieuchinhKhbdgComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule,
    KeHoachBanDauGiaModule
  ]
})
export class DieuchinhKhbdgModule { }
