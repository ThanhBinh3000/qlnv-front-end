import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { QdDieuchinhKhbttComponent } from './qd-dieuchinh-khbtt/qd-dieuchinh-khbtt.component';
import { ThemmoiQdDieuchinhKhbttComponent } from './qd-dieuchinh-khbtt/themmoi-qd-dieuchinh-khbtt/themmoi-qd-dieuchinh-khbtt.component';
import { ThongtinQdDieuchinhKhbttComponent } from './qd-dieuchinh-khbtt/themmoi-qd-dieuchinh-khbtt/thongtin-qd-dieuchinh-khbtt/thongtin-qd-dieuchinh-khbtt.component';



@NgModule({
  declarations: [
    QdDieuchinhKhbttComponent,
    ThemmoiQdDieuchinhKhbttComponent,
    ThongtinQdDieuchinhKhbttComponent,
  ],
  exports: [
    QdDieuchinhKhbttComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MainModule
  ]
})
export class DieuChinhKhBanTrucTiepModule { }