import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {XuatTieuHuyRoutingModule} from "./xuat-tieu-huy-routing.module";
import { QuyetDinhTieuHuyComponent } from './quyet-dinh-tieu-huy/quyet-dinh-tieu-huy.component';
import { ThemMoiQuyetDinhTieuHuyComponent } from './quyet-dinh-tieu-huy/them-moi-quyet-dinh-tieu-huy/them-moi-quyet-dinh-tieu-huy.component';
import {DirectivesModule} from "../../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../layout/main/main.module";
import {ComponentsModule} from "../../../components/components.module";
import {XuatTieuHuyComponent} from "./xuat-tieu-huy.component";



@NgModule({
  declarations: [

    QuyetDinhTieuHuyComponent,
    ThemMoiQuyetDinhTieuHuyComponent
  ],
  imports: [
    CommonModule,
    XuatTieuHuyRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
  ],
  exports: [
    QuyetDinhTieuHuyComponent,
    ThemMoiQuyetDinhTieuHuyComponent
  ],
  providers: [DatePipe]
})
export class XuatTieuHuyModule { }
