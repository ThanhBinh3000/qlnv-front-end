import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {ComponentsModule} from "../../../components/components.module";
import {DirectivesModule} from "../../../directives/directives.module";
import {XuatCuuTroVienTroRoutingModule} from "./xuat-cuu-tro-vien-tro-routing.module";
import {XuatCapModule} from "./xuat-cap/xuat-cap.module";
import {XuatCuuTroVienTroComponent} from "./xuat-cuu-tro-vien-tro.component";
import {CuuTroVienTroModule} from "./xuat-cuu-tro/cuu-tro-vien-tro.module";
import {XuatModule} from "src/app/pages/xuat/xuat.module";

@NgModule({
  declarations: [
    XuatCuuTroVienTroComponent,
  ],
  imports: [
    CommonModule,
    XuatCuuTroVienTroRoutingModule,
    DirectivesModule,
    ComponentsModule,
    CuuTroVienTroModule,
    XuatCapModule,
    XuatModule,
  ],
  exports: [
    XuatCuuTroVienTroComponent
  ],
  providers: [DatePipe]
})
export class XuatCuuTroVienTroModule {
}
