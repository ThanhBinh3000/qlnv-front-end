import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';
import { ChiTietDonViThucHienQuyetDinhComponent } from './luong-thuc/chi-tiet-don-vi-thuc-hien-quyet-dinh/chi-tiet-don-vi-thuc-hien-quyet-dinh.component';
import { HopDongMuaComponent } from './luong-thuc/hop-dong-mua/hop-dong-mua.component';
import { QuanLyBangKeCanHangComponent } from './luong-thuc/quan-ly-bang-ke-can-hang/quan-ly-bang-ke-can-hang.component';
import { ThongTinQuanLyBangKeCanHangComponent } from './luong-thuc/quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang.component';
import { QuanLyBienBanLayMauComponent } from './luong-thuc/quan-ly-bien-ban-lay-mau/quan-ly-bien-ban-lay-mau.component';
import { ThemMoiBienBanLayMauKhoComponent } from './luong-thuc/quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/them-moi-bien-ban-lay-mau.component';
import { QuanLyBienBanNghiemThuKeLotComponent } from './luong-thuc/quan-ly-bien-ban-nghiem-thu-ke-lot/quan-ly-bien-ban-nghiem-thu-ke-lot.component';
import { ThemMoiBienBanNghiemThuKeLotComponent } from './luong-thuc/quan-ly-bien-ban-nghiem-thu-ke-lot/them-moi-bien-ban-nghiem-thu-ke-lot/them-moi-bien-ban-nghiem-thu-ke-lot.component';
import { QuanLyPhieuKiemNghiemChatLuongComponent } from './luong-thuc/quan-ly-phieu-kiem-nghiem-chat-luong/quan-ly-phieu-kiem-nghiem-chat-luong.component';
import { ThemMoPhieuKiemNghiemChatLuongComponent } from './luong-thuc/quan-ly-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component';
import { QuanLyPhieuKiemTraChatLuongHangComponent } from './luong-thuc/quan-ly-phieu-kiem-tra-chat-luong-hang/quan-ly-phieu-kiem-tra-chat-luong-hang.component';
import { ThemMoiPhieuKiemTraChatLuongHangComponent } from './luong-thuc/quan-ly-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang.component';
import { QuanLyPhieuNhapDayKhoComponent } from './luong-thuc/quan-ly-phieu-nhap-day-kho/quan-ly-phieu-nhap-day-kho.component';
import { ThemMoiPhieuNhapDayKhoComponent } from './luong-thuc/quan-ly-phieu-nhap-day-kho/them-moi-phieu-nhap-day-kho/them-moi-phieu-nhap-day-kho.component';
import { QuanLyPhieuNhapKhoComponent } from './luong-thuc/quan-ly-phieu-nhap-kho/quan-ly-phieu-nhap-kho.component';
import { ThemMoiPhieuNhapKhoComponent } from './luong-thuc/quan-ly-phieu-nhap-kho/them-moi-phieu-nhap-kho/them-moi-phieu-nhap-kho.component';
import { ThongTinHopDongMuaComponent } from './luong-thuc/thong-tin-hop-dong-mua/thong-tin-hop-dong-mua.component';
import { ThongTinGiaoNhiemVuNhapXuatHangComponent } from './luong-thuc/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang.component';
import { NhapTheoPhuongThucDauThauComponent } from './nhap-theo-phuong-thuc-dau-thau/nhap-theo-phuong-thuc-dau-thau.component';
import { NhapTheoPhuongThucDauThauModule } from './nhap-theo-phuong-thuc-dau-thau/nhap-theo-phuong-thuc-dau-thau.module';
import { ThemmoiQdinhNhapXuatHangComponent } from './themmoi-qdinh-nhap-xuat-hang/themmoi-qdinh-nhap-xuat-hang.component';
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
    QuanLyPhieuNhapKhoComponent,
    ThemMoiPhieuNhapKhoComponent,
    QuanLyBienBanNghiemThuKeLotComponent,
    ThemMoiBienBanNghiemThuKeLotComponent,
    QuanLyPhieuKiemTraChatLuongHangComponent,
    ThemMoiPhieuKiemTraChatLuongHangComponent,
    QuanLyBangKeCanHangComponent,
    ThongTinQuanLyBangKeCanHangComponent,
    ThemMoiBienBanLayMauKhoComponent,
    QuanLyBienBanLayMauComponent,
    QuanLyPhieuKiemNghiemChatLuongComponent,
    ThemMoPhieuKiemNghiemChatLuongComponent,
    QuanLyPhieuNhapDayKhoComponent,
    ThemMoiPhieuNhapDayKhoComponent,
    ThemmoiQdinhNhapXuatHangComponent,
    NhapTheoPhuongThucDauThauComponent,
  ],
  imports: [
    CommonModule,
    DauThauRoutingModule,
    ComponentsModule,
    DirectivesModule,
  ],
})
export class DauThauModule {}
