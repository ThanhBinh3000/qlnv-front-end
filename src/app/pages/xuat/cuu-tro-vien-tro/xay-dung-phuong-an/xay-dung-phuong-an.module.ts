import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { XayDungPhuongAnComponent } from './xay-dung-phuong-an.component';
import { ThongTinXayDungPhuongAnComponent } from './thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component';
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";


@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule
  ],
  declarations: [
    XayDungPhuongAnComponent,
    ThongTinXayDungPhuongAnComponent,
  ],
  exports: [
    XayDungPhuongAnComponent,
    ThongTinXayDungPhuongAnComponent,
  ]
})
export class XayDungPhuongAnModule { }
