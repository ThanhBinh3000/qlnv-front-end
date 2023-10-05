import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuyetDinhXuatCapComponent } from './quyet-dinh-xuat-cap.component';
import { ComponentsModule } from "../../../../../components/components.module";
import { DirectivesModule } from "../../../../../directives/directives.module";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { ThongTinQuyetDinhXuatCapComponent } from './thong-tin-quyet-dinh-xuat-cap/thong-tin-quyet-dinh-xuat-cap.component';



@NgModule({
  declarations: [
    QuyetDinhXuatCapComponent,
    ThongTinQuyetDinhXuatCapComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule
  ],
  exports: [
    QuyetDinhXuatCapComponent
  ]
})
export class QuyetDinhXuatCapModule { }
