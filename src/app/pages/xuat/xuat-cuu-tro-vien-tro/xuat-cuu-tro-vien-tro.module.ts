import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";
import { ComponentsModule } from "../../../components/components.module";
import { DirectivesModule } from "../../../directives/directives.module";
import { XuatCuuTroVienTroRoutingModule } from "./xuat-cuu-tro-vien-tro-routing.module";
import { CuuTroVienTroModule } from "../cuu-tro-vien-tro/cuu-tro-vien-tro.module";
import { XuatCapModule } from "./xuat-cap/xuat-cap.module";
import { XuatCuuTroVienTroComponent } from "./xuat-cuu-tro-vien-tro.component";

@NgModule({
  declarations: [
    XuatCuuTroVienTroComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    XuatCuuTroVienTroRoutingModule,
    CuuTroVienTroModule,
    XuatCapModule,
  ],
  exports: [
    XuatCuuTroVienTroComponent
  ],
  providers: [DatePipe]
})
export class XuatCuuTroVienTroModule { }
