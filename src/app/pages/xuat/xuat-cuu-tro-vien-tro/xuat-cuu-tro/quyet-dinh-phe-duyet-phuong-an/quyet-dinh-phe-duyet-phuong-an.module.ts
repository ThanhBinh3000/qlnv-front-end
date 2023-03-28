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
import { XayDungPhuongAnModule } from '../xay-dung-phuong-an/xay-dung-phuong-an.module';
import { ThongTinXayDungPhuongAnComponent } from '../xay-dung-phuong-an/thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component';
import { TongHopPhuongAnModule } from '../tong-hop-phuong-an/tong-hop-phuong-an.module';
import { ThongTinTongHopPhuongAnComponent } from '../tong-hop-phuong-an/thong-tin-tong-hop-phuong-an/thong-tin-tong-hop-phuong-an.component';
@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    XayDungPhuongAnModule,
  ],
  declarations: [
    QuyetDinhPheDuyetPhuongAnComponent,
    ThongTinQuyetDinhPheDuyetPhuongAnComponent,
  ],
  exports: [
    QuyetDinhPheDuyetPhuongAnComponent,
    ThongTinQuyetDinhPheDuyetPhuongAnComponent,
    ThongTinXayDungPhuongAnComponent,

  ]
})
export class QuyetDinhPheDuyetPhuongAnModule {
}
