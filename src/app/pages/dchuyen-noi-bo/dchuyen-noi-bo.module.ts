import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DchuyenNoiBoRoutingModule } from './dchuyen-noi-bo-routing.module';
import {DchuyenNoiBoComponent} from "./dchuyen-noi-bo.component";
import {ComponentsModule} from "../../components/components.module";
import {MainModule} from "../../layout/main/main.module";
import {DieuChuyenNoiBoRoutingModule} from "../dieu-chuyen-noi-bo/dieu-chuyen-noi-bo-routing.module";
import {DirectivesModule} from "../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";


@NgModule({
  declarations: [DchuyenNoiBoComponent],
  imports: [
    CommonModule,
    DchuyenNoiBoRoutingModule,

    ComponentsModule,
    // MainModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule
  ]
})
export class DchuyenNoiBoModule { }
