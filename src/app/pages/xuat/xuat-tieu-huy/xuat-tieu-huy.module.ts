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
import {ThongBaoKetQuaComponent} from "./thong-bao-ket-qua/thong-bao-ket-qua.component";
import {
  ThemMoiThongBaoKetQuaComponent
} from "./thong-bao-ket-qua/them-moi-thong-bao-ket-qua/them-moi-thong-bao-ket-qua.component";
import {DanhSachHangTieuHuyComponent} from "./danh-sach-hang-tieu-huy/danh-sach-hang-tieu-huy.component";



@NgModule({
  declarations: [
    DanhSachHangTieuHuyComponent,
    QuyetDinhTieuHuyComponent,
    ThemMoiQuyetDinhTieuHuyComponent,
    ThongBaoKetQuaComponent,
    ThemMoiThongBaoKetQuaComponent
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
    DanhSachHangTieuHuyComponent,
    QuyetDinhTieuHuyComponent,
    ThemMoiQuyetDinhTieuHuyComponent,
    ThongBaoKetQuaComponent,
    ThemMoiThongBaoKetQuaComponent
  ],
  providers: [DatePipe]
})
export class XuatTieuHuyModule { }
