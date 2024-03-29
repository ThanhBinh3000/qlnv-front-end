import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { ThongTinHopDongComponent } from './thong-tin-hop-dong/thong-tin-hop-dong.component';
import {DirectivesModule} from "../../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../layout/main/main.module";
import {ComponentsModule} from "../../../components/components.module";
import {DauGiaModule} from "../../xuat/dau-gia/dau-gia.module";



@NgModule({
  declarations: [
    ThongTinHopDongComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
    DauGiaModule,
  ],
  exports: [
    ThongTinHopDongComponent,
  ],
  providers: [DatePipe]
})
export class CongTacDauGiaModule { }
