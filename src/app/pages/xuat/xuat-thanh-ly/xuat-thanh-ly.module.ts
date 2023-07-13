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
import {QuyetDinhThanhLyComponent} from './quyet-dinh-thanh-ly/quyet-dinh-thanh-ly.component';
import {
  ThemMoiQuyetDinhThanhLyComponent
} from './quyet-dinh-thanh-ly/them-moi-quyet-dinh-thanh-ly/them-moi-quyet-dinh-thanh-ly.component';
import {CuuTroVienTroModule} from "../xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.module";
import {BaoCaoKetQuaThanhLyComponent} from "./bao-cao-ket-qua/bao-cao-ket-qua-thanh-ly.component";
import {
  ThemMoiBaoCaoKetQuaThanhLyComponent
} from "./bao-cao-ket-qua/them-moi-bao-ket-qua-thanh-ly/them-moi-bao-cao-ket-qua-thanh-ly.component";
import {TongHopThanhLyComponent} from './tong-hop-thanh-ly/tong-hop-thanh-ly.component';
import {
  ChiTietTongHopThanhLyComponent
} from './tong-hop-thanh-ly/chi-tiet-tong-hop-thanh-ly/chi-tiet-tong-hop-thanh-ly.component';
import {ThongBaoKetQuaComponent} from "./thong-bao-ket-qua/thong-bao-ket-qua.component";
import {
  ThemMoiThongBaoKetQuaComponent
} from "./thong-bao-ket-qua/them-moi-thong-bao-ket-qua/them-moi-thong-bao-ket-qua.component";
import {HoSoThanhLyComponent} from './ho-so-thanh-ly/ho-so-thanh-ly.component';
import {ChiTietHoSoThanhLyComponent} from './ho-so-thanh-ly/chi-tiet-ho-so-thanh-ly/chi-tiet-ho-so-thanh-ly.component';
import { ToChucThucHienThanhLyComponent } from './to-chuc-thuc-hien-thanh-ly/to-chuc-thuc-hien-thanh-ly.component';
import { ThongTinDauGiaThanhLyComponent } from './to-chuc-thuc-hien-thanh-ly/thong-tin-dau-gia-thanh-ly/thong-tin-dau-gia-thanh-ly.component';
import { QuyetDinhPheDuyetKqBdgThanhLyComponent } from './to-chuc-thuc-hien-thanh-ly/quyet-dinh-phe-duyet-kq-bdg-thanh-ly/quyet-dinh-phe-duyet-kq-bdg-thanh-ly.component';


@NgModule({
  declarations: [
    XuatThanhLyComponent,
    ThanhLyDanhSachHangComponent,
    QuyetDinhThanhLyComponent,
    ThemMoiQuyetDinhThanhLyComponent,
    BaoCaoKetQuaThanhLyComponent,
    ThemMoiBaoCaoKetQuaThanhLyComponent,
    TongHopThanhLyComponent,
    ChiTietTongHopThanhLyComponent,
    ThemMoiBaoCaoKetQuaThanhLyComponent,
    ThongBaoKetQuaComponent,
    ThemMoiThongBaoKetQuaComponent,
    HoSoThanhLyComponent,
    ChiTietHoSoThanhLyComponent,
    ToChucThucHienThanhLyComponent,
    ThongTinDauGiaThanhLyComponent,
    QuyetDinhPheDuyetKqBdgThanhLyComponent
  ],
  imports: [
    CommonModule,
    XuatThanhLyRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
  ],
  exports: [
    ThanhLyDanhSachHangComponent
  ],
  providers: [DatePipe]
})
export class XuatThanhLyModule {
}
