import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {XuatThanhLyRoutingModule} from './xuat-thanh-ly-routing.module';
import {ComponentsModule} from "../../../components/components.module";
import {DirectivesModule} from "../../../directives/directives.module";
import {ThanhLyDanhSachHangComponent} from "./thanh-ly-danh-sach-hang/thanh-ly-danh-sach-hang.component";
import {XuatThanhLyComponent} from "./xuat-thanh-ly.component";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../layout/main/main.module";
import { QuyetDinhThanhLyComponent } from './quyet-dinh-thanh-ly/quyet-dinh-thanh-ly.component';
import { ThemMoiQuyetDinhThanhLyComponent } from './quyet-dinh-thanh-ly/them-moi-quyet-dinh-thanh-ly/them-moi-quyet-dinh-thanh-ly.component';
import {CuuTroVienTroModule} from "../xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.module";
import {BaoCaoKetQuaThanhLyComponent} from "./bao-cao-ket-qua/bao-cao-ket-qua-thanh-ly.component";
import {
  ThemMoiBaoCaoKetQuaThanhLyComponent
} from "./bao-cao-ket-qua/them-moi-bao-ket-qua-thanh-ly/them-moi-bao-cao-ket-qua-thanh-ly.component";


@NgModule({
  declarations: [
    XuatThanhLyComponent,
    ThanhLyDanhSachHangComponent,
    QuyetDinhThanhLyComponent,
    ThemMoiQuyetDinhThanhLyComponent,
    BaoCaoKetQuaThanhLyComponent,
    ThemMoiBaoCaoKetQuaThanhLyComponent
  ],
  imports: [
    CommonModule,
    XuatThanhLyRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
    CuuTroVienTroModule,
  ],
  exports: [
    ThanhLyDanhSachHangComponent
  ],
  providers: [DatePipe]
})
export class XuatThanhLyModule {
}
