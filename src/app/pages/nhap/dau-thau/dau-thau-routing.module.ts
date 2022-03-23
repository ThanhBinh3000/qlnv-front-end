import { ThemMoiBienBanLayMauKhoComponent } from './luong-thuc/quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/them-moi-bien-ban-lay-mau.component';
import { QuanLyBienBanLayMauComponent } from './luong-thuc/quan-ly-bien-ban-lay-mau/quan-ly-bien-ban-lay-mau.component';
import { ChiTietDonViThucHienQuyetDinhComponent } from './luong-thuc/chi-tiet-don-vi-thuc-hien-quyet-dinh/chi-tiet-don-vi-thuc-hien-quyet-dinh.component';
import { ThongTinGiaoNhiemVuNhapXuatHangComponent } from './luong-thuc/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang.component';
import { DanhSachDauThauComponent } from './luong-thuc/danh-sach-dau-thau/danh-sach-dau-thau.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DauThauComponent } from './dau-thau.component';
import { ThemMoiDeXuatKeHoachLuaChonNhaThauComponent } from './luong-thuc/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau.component';
import { ThongTinLuongDauThauGaoComponent } from './luong-thuc/thong-tin-luong-dau-thau-gao/thong-tin-luong-dau-thau-gao.component';
import { ThongTinChungPhuongAnTrinhTongCucComponent } from './luong-thuc/thong-tin-chung-phuong-an-trinh-tong-cuc/thong-tin-chung-phuong-an-trinh-tong-cuc.component';
import { LuongDauThauGaoComponent } from './luong-thuc/luong-dau-thau-gao/luong-dau-thau-gao.component';
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
import { QuanLyPhieuNhapKhoComponent } from './luong-thuc/quan-ly-phieu-nhap-kho/quan-ly-phieu-nhap-kho.component';
import { ThemMoiPhieuNhapKhoComponent } from './luong-thuc/quan-ly-phieu-nhap-kho/them-moi-phieu-nhap-kho/them-moi-phieu-nhap-kho.component';
import { QuanLyBienBanNghiemThuKeLotComponent } from './luong-thuc/quan-ly-bien-ban-nghiem-thu-ke-lot/quan-ly-bien-ban-nghiem-thu-ke-lot.component';
import { ThemMoiBienBanNghiemThuKeLotComponent } from './luong-thuc/quan-ly-bien-ban-nghiem-thu-ke-lot/them-moi-bien-ban-nghiem-thu-ke-lot/them-moi-bien-ban-nghiem-thu-ke-lot.component';
import { QuanLyPhieuKiemTraChatLuongHangComponent } from './luong-thuc/quan-ly-phieu-kiem-tra-chat-luong-hang/quan-ly-phieu-kiem-tra-chat-luong-hang.component';
import { ThemMoiPhieuKiemTraChatLuongHangComponent } from './luong-thuc/quan-ly-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang.component';
import { QuanLyBangKeCanHangComponent } from './luong-thuc/quan-ly-bang-ke-can-hang/quan-ly-bang-ke-can-hang.component';
import { ThongTinQuanLyBangKeCanHangComponent } from './luong-thuc/quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang.component';
import { QuanLyPhieuKiemNghiemChatLuongComponent } from './luong-thuc/quan-ly-phieu-kiem-nghiem-chat-luong/quan-ly-phieu-kiem-nghiem-chat-luong.component';
import { ThemMoPhieuKiemNghiemChatLuongComponent } from './luong-thuc/quan-ly-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component';

const routes: Routes = [
  {
    path: '',
    component: DauThauComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-sach-dau-thau',
        pathMatch: 'full',
      },
      {
        path: 'vat-tu',
        loadChildren: () =>
          import('../dau-thau/vat-tu/vat-tu.module').then((m) => m.VatTuModule),
      },
      {
        path: 'danh-sach-dau-thau/them-moi-de-xuat-ke-hoach-lua-chon-nha-thau/:id',
        component: ThemMoiDeXuatKeHoachLuaChonNhaThauComponent,
      },
      {
        path: 'luong-dau-thau-gao/thong-tin-luong-dau-thau-gao/:id',
        component: ThongTinLuongDauThauGaoComponent,
      },
      {
        path: 'luong-dau-thau-gao/thong-tin-chung-phuong-an-trinh-tong-cuc/:id',
        component: ThongTinChungPhuongAnTrinhTongCucComponent,
      },
      {
        path: 'luong-dau-thau-gao',
        component: LuongDauThauGaoComponent,
      },
      {
        path: 'danh-sach-dau-thau',
        component: DanhSachDauThauComponent,
      },
      {
        path: 'quyet-dinh-phe-duyet-ket-qua-lcnt',
        component: QuyetDinhPheDuyetKetQuaLCNTComponent,
      },
      {
        path: 'quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/:id',
        component: ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent,
      },
      {
        path: 'thong-tin-dau-thau',
        component: ThongTinDauThauComponent,
      },
      {
        path: 'thong-tin-dau-thau/chi-tiet-thong-tin-dau-thau/:id',
        component: ChiTietThongTinDauThauComponent,
      },
      {
        path: 'vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu',
        component: KeHoachLuaChonNhaThauVatTuComponent,
      },
      {
        path: 'vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu/thong-tin-ke-hoach-lua-chon-nha-thau-vat-tu/:id',
        component: ThongTinKeHoachLuaChonNhaThauVatTuComponent,
      },
      {
        path: 'vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu/du-thao-quyet-dinh/:id',
        component: DuThaoQuyetDinhComponent,
      },
      {
        path: 'vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu/nhap-quyet-dinh/:id',
        component: NhapQuyetDinhComponent,
      },
      {
        path: 'quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau',
        component: QuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent,
      },
      {
        path: 'quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lua-chon-nha-thau/:id',
        component: ThongTinQuyetDinhPheDuyetKeHoachLuaChonNhaThauComponent,
      },
      {
        path: 'phuong-an-trinh-tong-cuc',
        component: PhuongAnTrinhTongCucComponent,
      },
      {
        path: 'phuong-an-trinh-tong-cuc/thong-tin-chung-phuong-an-trinh-tong-cuc/:id',
        component: ThongTinChungPhuongAnTrinhTongCucComponent,
      },
      {
        path: 'hop-dong-mua',
        component: HopDongMuaComponent,
      },
      {
        path: 'hop-dong-mua/thong-tin-hop-dong-mua/:id',
        component: ThongTinHopDongMuaComponent,
      },
      {
        path: 'quyet-dinh-giao-nhiem-vu-nhap-hang',
        component: QuyetDinhGiaoNhiemVuNhapHangComponent,
      },
      {
        path: 'quyet-dinh-giao-nhiem-vu-nhap-hang/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang/:id',
        component: ThongTinGiaoNhiemVuNhapXuatHangComponent,
      },
      {
        path: 'quyet-dinh-giao-nhiem-vu-nhap-hang/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang/:id/chi-tiet-don-vi-thuc-hien-quyet-dinh/:id',
        component: ChiTietDonViThucHienQuyetDinhComponent,
      },
      {
        path: 'quan-ly-phieu-nhap-kho',
        component: QuanLyPhieuNhapKhoComponent,
      },
      {
        path: 'quan-ly-phieu-nhap-kho/them-moi-phieu-nhap-kho/:id',
        component: ThemMoiPhieuNhapKhoComponent,
      },
      {
        path: 'quan-ly-bien-ban-nghiem-thu-ke-lot',
        component: QuanLyBienBanNghiemThuKeLotComponent,
      },
      {
        path: 'quan-ly-bien-ban-nghiem-thu-ke-lot/them-moi-bien-ban-nghiem-thu-ke-lot/:id',
        component: ThemMoiBienBanNghiemThuKeLotComponent,
      },
      {
        path: 'quan-ly-phieu-kiem-tra-chat-luong-hang',
        component: QuanLyPhieuKiemTraChatLuongHangComponent,
      },
      {
        path: 'quan-ly-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang/:id',
        component: ThemMoiPhieuKiemTraChatLuongHangComponent,
      },
      {
        path: 'quan-ly-bang-ke-can-hang',
        component: QuanLyBangKeCanHangComponent,
      },
      {
        path: 'quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang/:id',
        component: ThongTinQuanLyBangKeCanHangComponent,
      },
      {
        path: 'quan-ly-bien-ban-lay-mau',
        component: QuanLyBienBanLayMauComponent,
      },
      {
        path: 'quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/:id',
        component: ThemMoiBienBanLayMauKhoComponent,
      },
      {
        path: 'quan-ly-phieu-kiem-nghiem-chat-luong',
        component: QuanLyPhieuKiemNghiemChatLuongComponent,
      },
      {
        path: 'quan-ly-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/:id',
        component: ThemMoPhieuKiemNghiemChatLuongComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauThauRoutingModule {}
