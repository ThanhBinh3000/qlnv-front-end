import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuaChuaRoutingModule } from './sua-chua-routing.module';
import {
  ChiTietDanhSachSuaChuaComponent
} from './danh-sach-sua-chua/chi-tiet-danh-sach-sua-chua/chi-tiet-danh-sach-sua-chua.component';
import { DanhSachSuaChuaComponent } from "src/app/pages/sua-chua/danh-sach-sua-chua/danh-sach-sua-chua.component";
import { DirectivesModule } from "src/app/directives/directives.module";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { MainModule } from "src/app/layout/main/main.module";
import { ComponentsModule } from "src/app/components/components.module";
import { SuaChuaComponent } from "src/app/pages/sua-chua/sua-chua.component";
import { TongHopComponent } from './tong-hop/tong-hop.component';
import { TrinhThamDinhComponent } from './trinh-tham-dinh/trinh-tham-dinh.component';
import { QuyetDinhComponent } from './quyet-dinh/quyet-dinh.component';
import { KiemTraClComponent } from './kiem-tra-cl/kiem-tra-cl.component';
import { BaoCaoComponent } from './bao-cao/bao-cao.component';
import { ThemMoiTtdComponent } from './trinh-tham-dinh/them-moi-ttd/them-moi-ttd.component';
import { ThemMoiQdComponent } from './quyet-dinh/them-moi-qd/them-moi-qd.component';
import { ThemMoiKtraclComponent } from './kiem-tra-cl/them-moi-ktracl/them-moi-ktracl.component';
import { ThemMoiBcComponent } from './bao-cao/them-moi-bc/them-moi-bc.component';
import { XuatHangModule } from './xuat-hang/xuat-hang.module';
import { ThemmoiThComponent } from './tong-hop/themmoi-th/themmoi-th.component';
import { ChitietThComponent } from './tong-hop/chitiet-th/chitiet-th.component';


@NgModule({
  declarations: [
    SuaChuaComponent,
    DanhSachSuaChuaComponent,
    ChiTietDanhSachSuaChuaComponent,
    TongHopComponent,
    TrinhThamDinhComponent,
    QuyetDinhComponent,
    KiemTraClComponent,
    BaoCaoComponent,
    ThemMoiTtdComponent,
    ThemMoiQdComponent,
    ThemMoiKtraclComponent,
    ThemMoiBcComponent,
    ThemmoiThComponent,
    ChitietThComponent,
  ],
  imports: [
    CommonModule,
    SuaChuaRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
    XuatHangModule
  ],
  exports: [
  ]
})
export class SuaChuaModule {
}
