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
import { TongChiMuaHangComponent } from './tong-chi-mua-hang/tong-chi-mua-hang.component';
import { ThemMoiTongChiMuaHangComponent } from './tong-chi-mua-hang/them-moi-tong-chi-mua-hang/them-moi-tong-chi-mua-hang.component';
import { SlGtriHangDtqgComponent } from './sl-gtri-hang-dtqg/sl-gtri-hang-dtqg.component';
import { ThemMoiSlGtriHangDtqgComponent } from './sl-gtri-hang-dtqg/them-moi-sl-gtri-hang-dtqg/them-moi-sl-gtri-hang-dtqg.component';
import { DialogThemMoiSlGtriHangDtqgComponent } from './sl-gtri-hang-dtqg/dialog-them-moi-sl-gtri-hang-dtqg/dialog-them-moi-sl-gtri-hang-dtqg.component';



@NgModule({
  declarations: [
    LapBaoCaoBoNganhComponent,
    NguonHinhThanhDtqgComponent,
    ThemMoiNguonHinhThanhDtqgComponent,
    TongChiMuaHangComponent,
    ThemMoiTongChiMuaHangComponent,
    SlGtriHangDtqgComponent,
    ThemMoiSlGtriHangDtqgComponent,
    DialogThemMoiSlGtriHangDtqgComponent
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
