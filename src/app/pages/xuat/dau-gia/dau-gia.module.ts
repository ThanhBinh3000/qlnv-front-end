import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DauGiaRoutingModule } from './dau-gia-routing.module';
import { DauGiaComponent } from './dau-gia.component';
import { DieuChinhModule } from './dieu-chinh/dieu-chinh.module';
import { GiaoNhapHangModule } from './giao-nhap-hang/giao-nhap-hang.module';
import { HopDongModule } from './hop-dong/hop-dong.module';
import { KehoachLuachonNhathauModule } from './kehoach-luachon-nhathau/kehoach-luachon-nhathau.module';
import { KiemTraChatLuongModule } from './kiem-tra-chat-luong/kiem-tra-chat-luong.module';
import { NhapKhoModule } from './nhap-kho/nhap-kho.module';
import { TrienkhaiLuachonNhathauModule } from './trienkhai-luachon-nhathau/trienkhai-luachon-nhathau.module';
import { XuatKhoComponent } from './xuat-kho/xuat-kho.component';
import { ChucNangXuatKhoComponent } from './xuat-kho/chuc-nang-xuat-kho/chuc-nang-xuat-kho.component';
import { QuanLyPhieuXuatKhoComponent } from './xuat-kho/quan-ly-phieu-xuat-kho/quan-ly-phieu-xuat-kho.component';
import { ThemMoiPhieuXuatKhoComponent } from './xuat-kho/quan-ly-phieu-xuat-kho/them-moi-phieu-xuat-kho/them-moi-phieu-xuat-kho.component';
@NgModule({
  declarations: [
    DauGiaComponent,
    XuatKhoComponent,
    ChucNangXuatKhoComponent,
    QuanLyPhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
  ],
  imports: [
    CommonModule,
    DauGiaRoutingModule,
    ComponentsModule,
    DirectivesModule,
    KiemTraChatLuongModule,
    GiaoNhapHangModule,
    NhapKhoModule,
    DieuChinhModule,
    HopDongModule,
    KehoachLuachonNhathauModule,
    TrienkhaiLuachonNhathauModule,
  ],
})
export class DauGiaModule { }
