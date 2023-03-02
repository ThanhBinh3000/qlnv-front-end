import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { QuyetDinhPheDuyetPhuongAnComponent } from "./quyet-dinh-phe-duyet-phuong-an.component";
import {
  ThongTinQuyetDinhPheDuyetPhuongAnComponent
} from "./thong-tin-quyet-dinh-phe-duyet-phuong-an/thong-tin-quyet-dinh-phe-duyet-phuong-an.component";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule
  ],
  declarations: [
    QuyetDinhPheDuyetPhuongAnComponent,
    ThongTinQuyetDinhPheDuyetPhuongAnComponent,
  ],
  exports: [
    QuyetDinhPheDuyetPhuongAnComponent,
    ThongTinQuyetDinhPheDuyetPhuongAnComponent,
  ]
})
export class QuyetDinhPheDuyetPhuongAnModule {
}
