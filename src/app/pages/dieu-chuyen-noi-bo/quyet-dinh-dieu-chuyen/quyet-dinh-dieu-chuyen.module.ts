import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuyetDinhDieuChuyenRoutingModule } from './quyet-dinh-dieu-chuyen-routing.module';
import { QuyetDinhDieuChuyenComponent } from './quyet-dinh-dieu-chuyen.component';
import { ComponentsModule } from "../../../components/components.module";
import { MainModule } from "../../../layout/main/main.module";
import { DirectivesModule } from "../../../directives/directives.module";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import { ThongTinQuyetDinhDieuChuyenComponent } from "./thong-tin-quyet-dinh-dieu-chuyen/thong-tin-quyet-dinh-dieu-chuyen.component";
import { ThongTinHangCanDieuChuyenComponent } from "./thong-tin-hang-can-dieu-chuyen/thong-tin-hang-can-dieu-chuyen.component";

@NgModule({
  declarations: [
    QuyetDinhDieuChuyenComponent,
    ThongTinQuyetDinhDieuChuyenComponent,
    ThongTinHangCanDieuChuyenComponent
  ],
  imports: [
    CommonModule,
    QuyetDinhDieuChuyenRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    NzCardModule,
    MainModule,
    ComponentsModule,
  ],
  exports: [
    QuyetDinhDieuChuyenComponent,
    ThongTinQuyetDinhDieuChuyenComponent,
    ThongTinHangCanDieuChuyenComponent
  ]
})
export class QuyetDinhDieuChuyenModule {
}
