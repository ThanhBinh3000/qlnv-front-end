import { ChiTietDonViThucHienQuyetDinhComponent } from './luong-thuc/chi-tiet-don-vi-thuc-hien-quyet-dinh/chi-tiet-don-vi-thuc-hien-quyet-dinh.component';
import { ThemMoiDeXuatKeHoachLuaChonNhaThauComponent } from './luong-thuc/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThongTinLuongDauThauGaoComponent } from './luong-thuc/thong-tin-luong-dau-thau-gao/thong-tin-luong-dau-thau-gao.component';
import { ThongTinChungPhuongAnTrinhTongCucComponent } from './luong-thuc/thong-tin-chung-phuong-an-trinh-tong-cuc/thong-tin-chung-phuong-an-trinh-tong-cuc.component';

import { DauThauRoutingModule } from './dau-thau-routing.module';
import { DauThauComponent } from './dau-thau.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { LuongDauThauGaoComponent } from './luong-thuc/luong-dau-thau-gao/luong-dau-thau-gao.component';
import { DanhSachDauThauComponent } from './luong-thuc/danh-sach-dau-thau/danh-sach-dau-thau.component';
import { QuyetDinhPheDuyetKetQuaLCNTComponent } from './luong-thuc/quyet-dinh-phe-duyet-ket-qua-lcnt/quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent } from './luong-thuc/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { ThongTinDauThauComponent } from './luong-thuc/thong-tin-dau-thau/thong-tin-dau-thau.component';
import { ChiTietThongTinDauThauComponent } from './luong-thuc/chi-tiet-thong-tin-dau-thau/chi-tiet-thong-tin-dau-thau.component';
import { KeHoachLuaChonNhaThauVatTuComponent } from './vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu.component';
import { ThongTinKeHoachLuaChonNhaThauVatTuComponent } from './vat-tu/thong-tin-ke-hoach-lua-chon-nha-thau-vat-tu/thong-tin-ke-hoach-lua-chon-nha-thau-vat-tu.component';
import { DuThaoQuyetDinhComponent } from './vat-tu/du-thao-quyet-dinh/du-thao-quyet-dinh.component';
import { NhapQuyetDinhComponent } from './vat-tu/nhap-quyet-dinh/nhap-quyet-dinh.component';
import { QuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent } from './luong-thuc/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.component';
import { ThongTinQuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent } from './luong-thuc/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau.component';
import { PhuongAnTrinhTongCucComponent } from './luong-thuc/phuong-an-trinh-tong-cuc/phuong-an-trinh-tong-cuc.component';
import { HopDongMuaComponent } from './luong-thuc/hop-dong-mua/hop-dong-mua.component';
import { ThongTinHopDongMuaComponent } from './luong-thuc/thong-tin-hop-dong-mua/thong-tin-hop-dong-mua.component';
import { QuyetDinhGiaoNhiemVuNhapHangComponent } from './luong-thuc/quyet-dinh-giao-nhiem-vu-nhap-hang/quyet-dinh-giao-nhiem-vu-nhap-hang.component';
import { ThongTinGiaoNhiemVuNhapXuatHangComponent } from './luong-thuc/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang.component';
import { QuanLyPhieuNhapKhoComponent } from './luong-thuc/quan-ly-phieu-nhap-kho/quan-ly-phieu-nhap-kho.component';
import { ThemMoiPhieuNhapKhoComponent } from './luong-thuc/quan-ly-phieu-nhap-kho/them-moi-phieu-nhap-kho/them-moi-phieu-nhap-kho.component';
import { QuanLyBienBanNghiemThuKeLotComponent } from './luong-thuc/quan-ly-bien-ban-nghiem-thu-ke-lot/quan-ly-bien-ban-nghiem-thu-ke-lot.component';
import { ThemMoiBienBanNghiemThuKeLotComponent } from './luong-thuc/quan-ly-bien-ban-nghiem-thu-ke-lot/them-moi-bien-ban-nghiem-thu-ke-lot/them-moi-bien-ban-nghiem-thu-ke-lot.component';
import { QuanLyPhieuKiemTraChatLuongHangComponent } from './luong-thuc/quan-ly-phieu-kiem-tra-chat-luong-hang/quan-ly-phieu-kiem-tra-chat-luong-hang.component';
import { ThemMoiPhieuKiemTraChatLuongHangComponent } from './luong-thuc/quan-ly-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang.component';

@NgModule({
  declarations: [
    DauThauComponent,
    ThemMoiDeXuatKeHoachLuaChonNhaThauComponent,
    ThongTinLuongDauThauGaoComponent,
    ThongTinChungPhuongAnTrinhTongCucComponent,
    LuongDauThauGaoComponent,
    DanhSachDauThauComponent,
    QuyetDinhPheDuyetKetQuaLCNTComponent,
    ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent,
    ThongTinDauThauComponent,
    ChiTietThongTinDauThauComponent,
    KeHoachLuaChonNhaThauVatTuComponent,
    ThongTinKeHoachLuaChonNhaThauVatTuComponent,
    DuThaoQuyetDinhComponent,
    NhapQuyetDinhComponent,
    QuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent,
    ThongTinQuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent,
    PhuongAnTrinhTongCucComponent,
    HopDongMuaComponent,
    ThongTinHopDongMuaComponent,
    QuyetDinhGiaoNhiemVuNhapHangComponent,
    ThongTinGiaoNhiemVuNhapXuatHangComponent,
    ChiTietDonViThucHienQuyetDinhComponent,
    QuanLyPhieuNhapKhoComponent,
    ThemMoiPhieuNhapKhoComponent,
    QuanLyBienBanNghiemThuKeLotComponent,
    ThemMoiBienBanNghiemThuKeLotComponent,
    QuanLyPhieuKiemTraChatLuongHangComponent,
    ThemMoiPhieuKiemTraChatLuongHangComponent,
  ],
  imports: [
    CommonModule,
    DauThauRoutingModule,
    ComponentsModule,
  ],
})
export class DauThauModule { }
