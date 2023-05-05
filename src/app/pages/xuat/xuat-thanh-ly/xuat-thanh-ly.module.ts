import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {XuatThanhLyRoutingModule} from './xuat-thanh-ly-routing.module';
import {ComponentsModule} from "../../../components/components.module";
import {DirectivesModule} from "../../../directives/directives.module";
import {ThanhLyDanhSachHangComponent} from "./thanh-ly-danh-sach-hang/thanh-ly-danh-sach-hang.component";
import {XuatThanhLyComponent} from "./xuat-thanh-ly.component";
import {DieuChuyenNoiBoRoutingModule} from "../../dieu-chuyen-noi-bo/dieu-chuyen-noi-bo-routing.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../layout/main/main.module";


@NgModule({
  declarations: [
    XuatThanhLyComponent,
    ThanhLyDanhSachHangComponent
  ],
  imports: [
    CommonModule,
    XuatThanhLyRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
  ],
  exports: [
    ThanhLyDanhSachHangComponent
  ],
  providers: [DatePipe]
})
export class XuatThanhLyModule {
}
