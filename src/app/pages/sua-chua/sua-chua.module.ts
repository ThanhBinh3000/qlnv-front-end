import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SuaChuaRoutingModule} from './sua-chua-routing.module';
import {
  ChiTietDanhSachSuaChuaComponent
} from './danh-sach-sua-chua/chi-tiet-danh-sach-sua-chua/chi-tiet-danh-sach-sua-chua.component';
import {DanhSachSuaChuaComponent} from "src/app/pages/sua-chua/danh-sach-sua-chua/danh-sach-sua-chua.component";
import {DirectivesModule} from "src/app/directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "src/app/layout/main/main.module";
import {ComponentsModule} from "src/app/components/components.module";
import {SuaChuaComponent} from "src/app/pages/sua-chua/sua-chua.component";


@NgModule({
  declarations: [
    SuaChuaComponent,
    DanhSachSuaChuaComponent,
    ChiTietDanhSachSuaChuaComponent
  ],
  imports: [
    CommonModule,
    SuaChuaRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
  ],
  exports: [
    DanhSachSuaChuaComponent,
  ]
})
export class SuaChuaModule {
}
