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

const routes: Routes = [
  {
    path: '',
    component: DauThauComponent,
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
    path: 'ke-hoach-lua-chon-nha-thau-vat-tu',
    component: KeHoachLuaChonNhaThauVatTuComponent,
  },
  {
    path: 'ke-hoach-lua-chon-nha-thau-vat-tu/thong-tin-ke-hoach-lua-chon-nha-thau-vat-tu/:id',
    component: ThongTinKeHoachLuaChonNhaThauVatTuComponent,
  },
  {
    path: 'ke-hoach-lua-chon-nha-thau-vat-tu/du-thao-quyet-dinh/:id',
    component: DuThaoQuyetDinhComponent,
  },
  {
    path: 'ke-hoach-lua-chon-nha-thau-vat-tu/nhap-quyet-dinh/:id',
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauThauRoutingModule {}
