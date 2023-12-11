import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { XuatThanhLyRoutingModule } from './xuat-thanh-ly-routing.module';
import { ComponentsModule } from "../../../components/components.module";
import { DirectivesModule } from "../../../directives/directives.module";
import { ThanhLyDanhSachHangComponent } from "./thanh-ly-danh-sach-hang/thanh-ly-danh-sach-hang.component";
import { XuatThanhLyComponent } from "./xuat-thanh-ly.component";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { MainModule } from "../../../layout/main/main.module";
import { QuyetDinhThanhLyComponent } from './quyet-dinh-thanh-ly/quyet-dinh-thanh-ly.component';
import {
  ThemMoiQuyetDinhThanhLyComponent
} from './quyet-dinh-thanh-ly/them-moi-quyet-dinh-thanh-ly/them-moi-quyet-dinh-thanh-ly.component';
import { BaoCaoKetQuaThanhLyComponent } from "./bao-cao-ket-qua/bao-cao-ket-qua-thanh-ly.component";
import {
  ThemMoiBaoCaoKetQuaThanhLyComponent
} from "./bao-cao-ket-qua/them-moi-bao-ket-qua-thanh-ly/them-moi-bao-cao-ket-qua-thanh-ly.component";
import { TongHopThanhLyComponent } from './tong-hop-thanh-ly/tong-hop-thanh-ly.component';
import { ThongBaoKetQuaComponent } from "./thong-bao-ket-qua/thong-bao-ket-qua.component";
import {
  ThemMoiThongBaoKetQuaComponent
} from "./thong-bao-ket-qua/them-moi-thong-bao-ket-qua/them-moi-thong-bao-ket-qua.component";
import { HoSoThanhLyComponent } from './ho-so-thanh-ly/ho-so-thanh-ly.component';
import { ChiTietHoSoThanhLyComponent } from './ho-so-thanh-ly/chi-tiet-ho-so-thanh-ly/chi-tiet-ho-so-thanh-ly.component';

import {
  QuyetDinhPheDuyetKqBdgThanhLyComponent
} from './to-chuc-thanh-ly/quyet-dinh-phe-duyet-kq-bdg-thanh-ly/quyet-dinh-phe-duyet-kq-bdg-thanh-ly.component';
import { HopDongThanhLyComponent } from './to-chuc-thanh-ly/hop-dong-thanh-ly/hop-dong-thanh-ly.component';
import {
  ChiTietQuyetDinhPheDuyetBdgThanhLyComponent
} from './to-chuc-thanh-ly/quyet-dinh-phe-duyet-kq-bdg-thanh-ly/chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly/chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly.component';
import { HopDongModule } from "../dau-gia/hop-dong/hop-dong.module";
import {
  QuanLyHopDongThanhLyComponent
} from './to-chuc-thanh-ly/hop-dong-thanh-ly/quan-ly-hop-dong-thanh-ly/quan-ly-hop-dong-thanh-ly.component';
import {
  ThongTinHopDongThanhLyComponent
} from './to-chuc-thanh-ly/hop-dong-thanh-ly/thong-tin-hop-dong-thanh-ly/thong-tin-hop-dong-thanh-ly.component';
import {
  QuyetDinhGiaoNhiemVuThanhLyComponent
} from './to-chuc-thanh-ly/quyet-dinh-giao-nhiem-vu-thanh-ly/quyet-dinh-giao-nhiem-vu-thanh-ly.component';
import {
  ChiTietQuyetDinhGiaoNhiemVuThanhLyComponent
} from './to-chuc-thanh-ly/quyet-dinh-giao-nhiem-vu-thanh-ly/chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly/chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly.component';

import { XuatModule } from "src/app/pages/xuat/xuat.module";
import { DauGiaModule } from "../dau-gia/dau-gia.module";
import { ThemmoiThComponent } from './tong-hop-thanh-ly/themmoi-th/themmoi-th.component';
import { ChitietThComponent } from './tong-hop-thanh-ly/chitiet-th/chitiet-th.component';
import { XuatHangThanhLyModule } from './xuat-hang-thanh-ly/xuat-hang-thanh-ly.module';
import { ChiTietHangTlComponent } from './thanh-ly-danh-sach-hang/chi-tiet-hang-tl/chi-tiet-hang-tl.component';


@NgModule({
  declarations: [
    XuatThanhLyComponent,
    ThanhLyDanhSachHangComponent,
    QuyetDinhThanhLyComponent,
    ThemMoiQuyetDinhThanhLyComponent,
    BaoCaoKetQuaThanhLyComponent,
    ThemMoiBaoCaoKetQuaThanhLyComponent,
    TongHopThanhLyComponent,
    ThemmoiThComponent,
    ChitietThComponent,
    ThemMoiBaoCaoKetQuaThanhLyComponent,
    ThongBaoKetQuaComponent,
    ThemMoiThongBaoKetQuaComponent,
    HoSoThanhLyComponent,
    ChiTietHoSoThanhLyComponent,
    QuyetDinhPheDuyetKqBdgThanhLyComponent,
    HopDongThanhLyComponent,
    QuyetDinhPheDuyetKqBdgThanhLyComponent,
    ChiTietQuyetDinhPheDuyetBdgThanhLyComponent,
    QuanLyHopDongThanhLyComponent,
    ThongTinHopDongThanhLyComponent,
    QuyetDinhGiaoNhiemVuThanhLyComponent,
    ChiTietQuyetDinhGiaoNhiemVuThanhLyComponent,
    ChiTietHangTlComponent,
  ],
  imports: [
    CommonModule,
    XuatThanhLyRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
    HopDongModule,
    XuatModule,
    DauGiaModule,
    XuatHangThanhLyModule
  ],
  exports: [
    ThanhLyDanhSachHangComponent
  ],
  providers: [DatePipe]
})
export class XuatThanhLyModule {
}

