import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NguonHinhThanhDtqgComponent } from './nguon-hinh-thanh-dtqg/nguon-hinh-thanh-dtqg.component';
import { LapBaoCaoBoNganhRoutingModule } from "./lap-bao-cao-bo-nganh-routing.module";
import { ComponentsModule } from "../../../components/components.module";
import { MainModule } from "../../../layout/main/main.module";
import { NzTreeViewModule } from "ng-zorro-antd/tree-view";
import { DirectivesModule } from "../../../directives/directives.module";
import { NzIconModule } from "ng-zorro-antd/icon";
import { LapBaoCaoBoNganhComponent } from "./lap-bao-cao-bo-nganh.component";
import { ThemMoiNguonHinhThanhDtqgComponent } from './nguon-hinh-thanh-dtqg/them-moi-nguon-hinh-thanh-dtqg/them-moi-nguon-hinh-thanh-dtqg.component';



@NgModule({
  declarations: [
    LapBaoCaoBoNganhComponent,
    NguonHinhThanhDtqgComponent,
    ThemMoiNguonHinhThanhDtqgComponent
  ],
  imports: [
    CommonModule,
    LapBaoCaoBoNganhRoutingModule,
    ComponentsModule,
    MainModule,
    NzTreeViewModule,
    DirectivesModule,
    NzIconModule
  ]
})
export class LapBaoCaoBoNganhModule { }
