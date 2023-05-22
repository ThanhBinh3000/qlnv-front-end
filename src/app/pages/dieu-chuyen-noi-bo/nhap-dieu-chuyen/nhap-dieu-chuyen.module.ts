import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from "../../../components/components.module";
import { MainModule } from "../../../layout/main/main.module";
import { DirectivesModule } from "../../../directives/directives.module";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { NzCardModule } from "ng-zorro-antd/card";

import { NhapDieuChuyenComponent } from './nhap-dieu-chuyen.component';
import { NhapDieuChuyenRoutingModule } from './nhap-dieu-chuyen-routing.module';
import { NoiBoChiCucComponent } from './noi-bo-chi-cuc/noi-bo-chi-cuc.component';
import { GiuaHaiChiCucComponent } from './giua-hai-chi-cuc/giua-hai-chi-cuc.component';
import { GiuaHaiCucComponent } from './giua-hai-cuc/giua-hai-cuc.component';
import { ChatLuongLuongThucComponent } from './chat-luong-luong-thuc/chat-luong-luong-thuc.component';
import { ChatLuongVatTuComponent } from './chat-luong-vat-tu/chat-luong-vat-tu.component';
import { XuatKhoVatTuComponent } from './xuat-kho-vat-tu/xuat-kho-vat-tu.component';
import { XuatKhoLuongThucComponent } from './xuat-kho-luong-thuc/xuat-kho-luong-thuc.component';
import { BienBanMauComponent } from './bien-ban-mau/bien-ban-mau.component';
import { KiemNghiemChatLuongComponent } from './kiem-nghiem-chat-luong/kiem-nghiem-chat-luong.component';
import { HoSoKyThuatComponent } from './ho-so-ky-thuat/ho-so-ky-thuat.component';
import { PhieuXuatKhoComponent } from './phieu-xuat-kho/phieu-xuat-kho.component';
import { BangKeCanHangComponent } from './bang-ke-can-hang/bang-ke-can-hang.component';
import { BienBanTinhKhoComponent } from './bien-ban-tinh-kho/bien-ban-tinh-kho.component';
import { BienBanHaoDoiComponent } from './bien-ban-hao-doi/bien-ban-hao-doi.component';
import { BangKeNhapVatTuComponent } from './bang-ke-nhap-vat-tu/bang-ke-nhap-vat-tu.component';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong/kiem-tra-chat-luong.component';
import { BienBanNghiemThuBaoQuanLanDauComponent } from './bien-ban-nghiem-thu-bao-quan-lan-dau/bien-ban-nghiem-thu-bao-quan-lan-dau.component';



@NgModule({
  declarations: [
    NhapDieuChuyenComponent,
    NoiBoChiCucComponent,
    GiuaHaiChiCucComponent,
    GiuaHaiCucComponent,
    ChatLuongLuongThucComponent,
    ChatLuongVatTuComponent,
    XuatKhoVatTuComponent,
    XuatKhoLuongThucComponent,
    BienBanMauComponent,
    KiemNghiemChatLuongComponent,
    HoSoKyThuatComponent,
    PhieuXuatKhoComponent,
    BangKeCanHangComponent,
    BienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    BangKeNhapVatTuComponent,
    KiemTraChatLuongComponent,
    BienBanNghiemThuBaoQuanLanDauComponent
  ],
  imports: [
    CommonModule,
    NhapDieuChuyenRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    NzCardModule,
    MainModule,
    ComponentsModule,
  ]
})
export class NhapDieuChuyenModule { }
