import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaoCaoBoNganhComponent } from "./bao-cao-bo-nganh.component";
import { ComponentsModule } from "../../components/components.module";
import { MainModule } from "../../layout/main/main.module";
import { BaoCaoBoNganhRoutingModule } from "./bao-cao-bo-nganh-routing.module";
import { DirectivesModule } from "../../directives/directives.module";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";



@NgModule({
  declarations: [BaoCaoBoNganhComponent],
  imports: [
    CommonModule,
    BaoCaoBoNganhRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
  ]
})
export class BaoCaoBoNganhModule { }
