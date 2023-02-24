import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../../../../components/components.module";
import { DirectivesModule } from "../../../../../directives/directives.module";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { QuyetDinhPhuongAnComponent } from "./quyet-dinh-phuong-an.component";
import { ThongTinQuyetDinhPhuongAnComponent } from './thong-tin-quyet-dinh-phuong-an/thong-tin-quyet-dinh-phuong-an.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule
  ],
  declarations: [
    QuyetDinhPhuongAnComponent,
    ThongTinQuyetDinhPhuongAnComponent
  ],
  exports: [
    QuyetDinhPhuongAnComponent
  ]
})
export class QuyetDinhPhuongAnModule {
}
