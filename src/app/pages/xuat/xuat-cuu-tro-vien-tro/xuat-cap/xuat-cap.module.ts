import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { XuatCapComponent } from "./xuat-cap.component";
import { XuatKhoComponent } from './xuat-kho/xuat-kho.component';
import { QuyetDinhGnvXuatHangComponent } from './quyet-dinh-gnv-xuat-hang/quyet-dinh-gnv-xuat-hang.component';
import {
  PhieuKiemNghiemChatLuongComponent
} from "./kiem-tra-chat-luong/phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component";
import {
  PhieuKiemTraChatLuongComponent
} from "./kiem-tra-chat-luong/phieu-kiem-tra-chat-luong/phieu-kiem-tra-chat-luong.component";
import { KiemTraChatLuongComponent } from "./kiem-tra-chat-luong/kiem-tra-chat-luong.component";
import {
  MainPhieuKiemTraChatLuongComponent
} from "./kiem-tra-chat-luong/main-phieu-kiem-tra-chat-luong/main-phieu-kiem-tra-chat-luong.component";
import {
  ThemMoiPhieuKiemNghiemChatLuongComponent
} from "./kiem-tra-chat-luong/phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component";
import {
  ThemMoiPhieuKiemTraChatLuongComponent
} from "./kiem-tra-chat-luong/phieu-kiem-tra-chat-luong/them-moi-phieu-kiem-tra-chat-luong/them-moi-phieu-kiem-tra-chat-luong.component";
import {
  ThongTinQdGnvXuatHangComponent
} from "./quyet-dinh-gnv-xuat-hang/thong-tin-qd-gnv-xuat-hang/thong-tin-qd-gnv-xuat-hang.component";
import { QuyetDinhPhuongAnComponent } from "./quyet-dinh-phuong-an/quyet-dinh-phuong-an.component";
import {
  ThongTinQuyetDinhPhuongAnComponent
} from "./quyet-dinh-phuong-an/thong-tin-quyet-dinh-phuong-an/thong-tin-quyet-dinh-phuong-an.component";
import { QuyetDinhXuatCapComponent } from "./quyet-dinh-xuat-cap/quyet-dinh-xuat-cap.component";
import {
  ThongTinQuyetDinhXuatCapComponent
} from "./quyet-dinh-xuat-cap/thong-tin-quyet-dinh-xuat-cap/thong-tin-quyet-dinh-xuat-cap.component";
import { MainXuatKhoComponent } from "./xuat-kho/main-xuat-kho/main-xuat-kho.component";
import { BangKeCanComponent } from "./xuat-kho/bang-ke-can/bang-ke-can.component";
import {
  ThemMoiPhieuXuatKhoComponent
} from "./xuat-kho/phieu-xuat-kho/them-moi-phieu-xuat-kho/them-moi-phieu-xuat-kho.component";
import {
  ThemMoiBienBanTinhKhoComponent
} from "./xuat-kho/bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component";
import { PhieuXuatKhoComponent } from "./xuat-kho/phieu-xuat-kho/phieu-xuat-kho.component";
import { BienBanTinhKhoComponent } from "./xuat-kho/bien-ban-tinh-kho/bien-ban-tinh-kho.component";
import {
  ThemMoiBienBanHaoDoiComponent
} from "./xuat-kho/bien-ban-hao-doi/them-moi-bien-ban-hao-doi/them-moi-bien-ban-hao-doi.component";
import { BienBanHaoDoiComponent } from "./xuat-kho/bien-ban-hao-doi/bien-ban-hao-doi.component";
import { ComponentsModule } from "../../../../components/components.module";
import { DirectivesModule } from "../../../../directives/directives.module";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { CuuTroVienTroRoutingModule } from "../xuat-cuu-tro/cuu-tro-vien-tro-routing.module";
import { ChiTietBangKeCanComponent } from "./xuat-kho/bang-ke-can/chi-tiet-bang-ke-can/chi-tiet-bang-ke-can.component";
import { CuuTroVienTroModule } from "../xuat-cuu-tro/cuu-tro-vien-tro.module";
import { CuuTroVienTroComponent } from "../xuat-cuu-tro/cuu-tro-vien-tro.component";
import { XuatModule } from "../../xuat.module";


@NgModule({
  declarations: [
    XuatCapComponent,
    XuatKhoComponent,
    QuyetDinhGnvXuatHangComponent,

    PhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,
    MainPhieuKiemTraChatLuongComponent,
    KiemTraChatLuongComponent,
    PhieuKiemTraChatLuongComponent,
    ThemMoiPhieuKiemTraChatLuongComponent,

    ThongTinQdGnvXuatHangComponent,

    QuyetDinhPhuongAnComponent,
    ThongTinQuyetDinhPhuongAnComponent,

    QuyetDinhXuatCapComponent,
    // ThongTinQuyetDinhXuatCapComponent,

    MainXuatKhoComponent,
    PhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
    BangKeCanComponent,
    BienBanTinhKhoComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    ThemMoiBienBanHaoDoiComponent,

    ChiTietBangKeCanComponent
  ],
  exports: [
    XuatCapComponent,
    XuatCapComponent,
    XuatKhoComponent,
    QuyetDinhGnvXuatHangComponent,

    PhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,
    MainPhieuKiemTraChatLuongComponent,
    KiemTraChatLuongComponent,
    PhieuKiemTraChatLuongComponent,
    ThemMoiPhieuKiemTraChatLuongComponent,

    ThongTinQdGnvXuatHangComponent,

    QuyetDinhPhuongAnComponent,
    ThongTinQuyetDinhPhuongAnComponent,

    QuyetDinhXuatCapComponent,
    // ThongTinQuyetDinhXuatCapComponent,

    MainXuatKhoComponent,
    PhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
    BangKeCanComponent,
    BienBanTinhKhoComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    ThemMoiBienBanHaoDoiComponent,

    ChiTietBangKeCanComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    CuuTroVienTroRoutingModule,
    CuuTroVienTroModule,
    XuatModule,
  ],
  providers: [CuuTroVienTroComponent]
})
export class XuatCapModule {
}
