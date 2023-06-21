import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from "../../../components/components.module";
import { MainModule } from "../../../layout/main/main.module";
import { DirectivesModule } from "../../../directives/directives.module";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { NzCardModule } from "ng-zorro-antd/card";

import { QuyetDinhDieuChuyenRoutingModule } from './quyet-dinh-dieu-chuyen-routing.module';
import { QuyetDinhDieuChuyenComponent } from './quyet-dinh-dieu-chuyen.component';

import { QuyetDinhDieuChuyenTCComponent } from './tong-cuc/quyet-dinh-dieu-chuyen-tc/quyet-dinh-dieu-chuyen-tc.component';
import { ThongTinQuyetDinhDieuChuyenTCComponent } from "./tong-cuc/thong-tin-quyet-dinh-dieu-chuyen-tc/thong-tin-quyet-dinh-dieu-chuyen-tc.component";

import { QuyetDinhDieuChuyenCucComponent } from './cuc/quyet-dinh-dieu-chuyen-cuc/quyet-dinh-dieu-chuyen-cuc.component';
import { ThongTinQuyetDinhDieuChuyenCucComponent } from "./cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc.component";
import { ThongTinHangCanDieuChuyenCucComponent } from "./cuc/thong-tin-hang-can-dieu-chuyen-cuc/thong-tin-hang-can-dieu-chuyen-cuc.component";
import { ThongTinHangCanDieuChuyenChiCucComponent } from "./cuc/thong-tin-hang-can-dieu-chuyen-chi-cuc/thong-tin-hang-can-dieu-chuyen-chi-cuc.component";

@NgModule({
  declarations: [
    QuyetDinhDieuChuyenComponent,
    QuyetDinhDieuChuyenTCComponent,
    ThongTinQuyetDinhDieuChuyenTCComponent,
    QuyetDinhDieuChuyenCucComponent,
    ThongTinQuyetDinhDieuChuyenCucComponent,
    ThongTinHangCanDieuChuyenCucComponent,
    ThongTinHangCanDieuChuyenChiCucComponent,
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
    QuyetDinhDieuChuyenTCComponent,
    ThongTinQuyetDinhDieuChuyenTCComponent,
    QuyetDinhDieuChuyenCucComponent,
    ThongTinQuyetDinhDieuChuyenCucComponent,
    ThongTinHangCanDieuChuyenCucComponent,
    ThongTinHangCanDieuChuyenChiCucComponent,
  ]
})
export class QuyetDinhDieuChuyenModule {
}
