import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';
import { GiaoNhapHangComponent } from './giao-nhap-hang/giao-nhap-hang.component';
import { ThemmoiQdinhNhapXuatHangComponent } from './giao-nhap-hang/themmoi-qdinh-nhap-xuat-hang/themmoi-qdinh-nhap-xuat-hang.component';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong/kiem-tra-chat-luong.component';
import { LapBienBanNghiemThuBaoQuanComponent } from './kiem-tra-chat-luong/lap-bien-ban-nghiem-thu-bao-quan/lap-bien-ban-nghiem-thu-bao-quan.component';
import { ThongTinBienBanNghiemThuBaoQuanComponent } from './kiem-tra-chat-luong/lap-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan.component';
import { ChiTietDonViThucHienQuyetDinhComponent } from './luong-thuc/chi-tiet-don-vi-thuc-hien-quyet-dinh/chi-tiet-don-vi-thuc-hien-quyet-dinh.component';
import { HopDongMuaComponent } from './luong-thuc/hop-dong-mua/hop-dong-mua.component';
import { QuanLyBienBanNghiemThuKeLotComponent } from './luong-thuc/quan-ly-bien-ban-nghiem-thu-ke-lot/quan-ly-bien-ban-nghiem-thu-ke-lot.component';
import { ThemMoiBienBanNghiemThuKeLotComponent } from './luong-thuc/quan-ly-bien-ban-nghiem-thu-ke-lot/them-moi-bien-ban-nghiem-thu-ke-lot/them-moi-bien-ban-nghiem-thu-ke-lot.component';
import { QuanLyPhieuKiemNghiemChatLuongComponent } from './luong-thuc/quan-ly-phieu-kiem-nghiem-chat-luong/quan-ly-phieu-kiem-nghiem-chat-luong.component';
import { ThemMoPhieuKiemNghiemChatLuongComponent } from './luong-thuc/quan-ly-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component';
import { ThongTinHopDongMuaComponent } from './luong-thuc/thong-tin-hop-dong-mua/thong-tin-hop-dong-mua.component';
import { ThongTinGiaoNhiemVuNhapXuatHangComponent } from './luong-thuc/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang.component';
import { DuThaoQuyetDinhComponent } from './vat-tu/du-thao-quyet-dinh/du-thao-quyet-dinh.component';
import { KeHoachLuaChonNhaThauVatTuComponent } from './vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu.component';
import { NhapQuyetDinhComponent } from './vat-tu/nhap-quyet-dinh/nhap-quyet-dinh.component';
import { ThongTinKeHoachLuaChonNhaThauVatTuComponent } from './vat-tu/thong-tin-ke-hoach-lua-chon-nha-thau-vat-tu/thong-tin-ke-hoach-lua-chon-nha-thau-vat-tu.component';

@NgModule({
  declarations: [
    DauThauComponent,
    KeHoachLuaChonNhaThauVatTuComponent,
    ThongTinKeHoachLuaChonNhaThauVatTuComponent,
    DuThaoQuyetDinhComponent,
    NhapQuyetDinhComponent,
    HopDongMuaComponent,
    ThongTinHopDongMuaComponent,
    ThongTinGiaoNhiemVuNhapXuatHangComponent,
    ChiTietDonViThucHienQuyetDinhComponent,
    QuanLyBienBanNghiemThuKeLotComponent,
    ThemMoiBienBanNghiemThuKeLotComponent,
    QuanLyPhieuKiemNghiemChatLuongComponent,
    ThemMoPhieuKiemNghiemChatLuongComponent,
    GiaoNhapHangComponent,
    ThemmoiQdinhNhapXuatHangComponent,
    KiemTraChatLuongComponent,
    LapBienBanNghiemThuBaoQuanComponent,
    ThongTinBienBanNghiemThuBaoQuanComponent,
  ],
  imports: [
    CommonModule,
    DauThauRoutingModule,
    ComponentsModule,
    DirectivesModule,
  ],
})
export class DauThauModule { }
