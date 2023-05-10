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
import { ThopNhapXuatHangDTQGComponent } from "./thop-nhap-xuat-hang-dtqg/thop-nhap-xuat-hang-dtqg.component";
import {
  ThemMoiThopNhapXuatHangDtqgComponent
} from "./thop-nhap-xuat-hang-dtqg/them-moi-thop-nhap-xuat-hang-dtqg/them-moi-thop-nhap-xuat-hang-dtqg.component";
import { TangHangDtqgComponent } from './tang-hang-dtqg/tang-hang-dtqg.component';
import { ThemMoiTangHangDtqgComponent } from './tang-hang-dtqg/them-moi-tang-hang-dtqg/them-moi-tang-hang-dtqg.component';
import { GiamHangDtqgComponent } from './giam-hang-dtqg/giam-hang-dtqg.component';
import { ThemMoiGiamHangDtqgComponent } from './giam-hang-dtqg/them-moi-giam-hang-dtqg/them-moi-giam-hang-dtqg.component';



@NgModule({
  declarations: [
    LapBaoCaoBoNganhComponent,
    NguonHinhThanhDtqgComponent,
    ThemMoiNguonHinhThanhDtqgComponent,
    ThopNhapXuatHangDTQGComponent,
    ThemMoiThopNhapXuatHangDtqgComponent,
    TangHangDtqgComponent,
    ThemMoiTangHangDtqgComponent,
    GiamHangDtqgComponent,
    ThemMoiGiamHangDtqgComponent
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
