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
import {TongHopTieuHuyComponent} from "./tong-hop-tieu-huy/tong-hop-tieu-huy.component";

import {HoSoTieuHuyComponent} from "./ho-so-tieu-huy/ho-so-tieu-huy.component";
import {ChiTietHoSoTieuHuyComponent} from "./ho-so-tieu-huy/chi-tiet-ho-so-tieu-huy/chi-tiet-ho-so-tieu-huy.component";
import {BaoCaoKetQuaTieuHuyComponent} from "./bao-cao-ket-qua-tieu-huy/bao-cao-ket-qua-tieu-huy.component";
import {
  ThemMoiBaoCaoKetQuaTieuHuyComponent
} from "./bao-cao-ket-qua-tieu-huy/them-moi-bao-ket-qua-tieu-huy/them-moi-bao-cao-ket-qua-tieu-huy.component";
import { ThemmoiThThComponent } from './tong-hop-tieu-huy/themmoi-th-th/themmoi-th-th.component';
import { ChitietThThComponent } from './tong-hop-tieu-huy/chitiet-th-th/chitiet-th-th.component';
import { ChiTietDsThComponent } from './danh-sach-hang-tieu-huy/chi-tiet-ds-th/chi-tiet-ds-th.component';



@NgModule({
  declarations: [
    DanhSachHangTieuHuyComponent,
    TongHopTieuHuyComponent,
    HoSoTieuHuyComponent,
    ChiTietHoSoTieuHuyComponent,
    QuyetDinhTieuHuyComponent,
    ThemMoiQuyetDinhTieuHuyComponent,
    ThongBaoKetQuaComponent,
    ThemMoiThongBaoKetQuaComponent,
    BaoCaoKetQuaTieuHuyComponent,
    ThemMoiBaoCaoKetQuaTieuHuyComponent,
    ThemmoiThThComponent,
    ChitietThThComponent,
    ChiTietDsThComponent,
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
    TongHopTieuHuyComponent,
    HoSoTieuHuyComponent,
    ChiTietHoSoTieuHuyComponent,
    QuyetDinhTieuHuyComponent,
    ThemMoiQuyetDinhTieuHuyComponent,
    ThongBaoKetQuaComponent,
    ThemMoiThongBaoKetQuaComponent,
    BaoCaoKetQuaTieuHuyComponent,
    ThemMoiBaoCaoKetQuaTieuHuyComponent,
  ],
  providers: [DatePipe]
})
export class XuatTieuHuyModule { }
