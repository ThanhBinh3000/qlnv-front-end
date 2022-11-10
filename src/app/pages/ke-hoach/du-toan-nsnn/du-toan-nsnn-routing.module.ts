import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DIEU_CHINH_DU_TOAN } from './dieu-chinh-du-toan-chi-nsnn/dieu-chinh-du-toan-chi-nsnn.constant';
import { DuToanNsnnComponent } from './du-toan-nsnn.component';
import { GIAO_DU_TOAN } from './giao-du-toan-chi-nsnn/giao-du-toan-chi-nsnn.constant';

const routes: Routes = [
  {
    path: '',
    component: DuToanNsnnComponent,
  },
  /////////// DIEU CHINH DU TOAN CHI NSNN ROUTING
  {
    path: DIEU_CHINH_DU_TOAN + '/tim-kiem-dieu-chinh-du-toan-chi-NSNN',
    loadChildren: () =>
      import(
        './dieu-chinh-du-toan-chi-nsnn/tim-kiem-dieu-chinh-du-toan-chi-NSNN/tim-kiem-dieu-chinh-du-toan-chi-NSNN.module'
      ).then((m) => m.TimKiemDieuChinhDuToanChiNSNNModule),
  },
  {
    path: DIEU_CHINH_DU_TOAN + '/ds-tong-hop-dieu-chinh-du-toan-chi',
    loadChildren: () =>
      import(
        './dieu-chinh-du-toan-chi-nsnn/ds-tong-hop-dieu-chinh-du-toan-chi/ds-tong-hop-dieu-chinh-du-toan-chi.module'
      ).then((m) => m.DsTongHopDieuChinhDuToanChiModule),
  },
  {
    path: DIEU_CHINH_DU_TOAN + '/tong-hop-dieu-chinh-du-toan-chi-NSNN',
    loadChildren: () =>
      import(
        './dieu-chinh-du-toan-chi-nsnn/tong-hop-dieu-chinh-du-toan-chi-NSNN/tong-hop-dieu-chinh-du-toan-chi-NSNN.module'
      ).then((m) => m.TongHopDieuChinhDuToanChiNSNNModule),
  },
  {
    path: DIEU_CHINH_DU_TOAN + '/giao-nhiem-vu',
    loadChildren: () =>
      import(
        './dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/giao-nhiem-vu.module'
      ).then((m) => m.GiaoNhiemVuModule),
  },
  {
    path: DIEU_CHINH_DU_TOAN + '/giao-nhiem-vu/:id',
    loadChildren: () =>
      import(
        './dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/giao-nhiem-vu.module'
      ).then((m) => m.GiaoNhiemVuModule),
  },
  {
    path: DIEU_CHINH_DU_TOAN + '/giao-nhiem-vu-/:id',
    loadChildren: () =>
      import(
        './dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/giao-nhiem-vu.module'
      ).then((m) => m.GiaoNhiemVuModule),
  },
  {
    path: DIEU_CHINH_DU_TOAN + '/giao-nhiem-vu-/:dotBcao/:namHienHanh/:maDvi',
    loadChildren: () =>
      import(
        './dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/giao-nhiem-vu.module'
      ).then((m) => m.GiaoNhiemVuModule),
  },
  {
    path: DIEU_CHINH_DU_TOAN + '/giao-nhiem-vu/0/:namHienHanh',
    loadChildren: () =>
      import(
        './dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/giao-nhiem-vu.module'
      ).then((m) => m.GiaoNhiemVuModule),
  },
  {
    path: DIEU_CHINH_DU_TOAN + '/giao-nhiem-vu/:loai/:id',
    loadChildren: () =>
      import(
        './dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/giao-nhiem-vu.module'
      ).then((m) => m.GiaoNhiemVuModule),
  },
  {
    path: DIEU_CHINH_DU_TOAN + '/phe-duyet-bao-cao-dieu-chinh',
    loadChildren: () =>
      import(
        './dieu-chinh-du-toan-chi-nsnn/phe-duyet-bao-cao-dieu-chinh/phe-duyet-bao-cao-dieu-chinh.module'
      ).then((m) => m.PheDuyetBaoCaoDieuChinhModule),
  },
  {
    path: DIEU_CHINH_DU_TOAN + '/chi-tiet-giao-nhiem-vu/:loai/:id',
    loadChildren: () =>
      import(
        './dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/giao-nhiem-vu.module'
      ).then((m) => m.GiaoNhiemVuModule),
  },
  // //////////////////////// GIAO DU TOAN CHI NSNN ////////////////////////////
  {
    path: GIAO_DU_TOAN + '/tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN/tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN.module'
      ).then((m) => m.TimKiemQuyetDinhNhapDuToanChiNSNNModule),
  },
  {
    path: GIAO_DU_TOAN + '/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/nhap-quyet-dinh-giao-du-toan-chi-NSNN/nhap-quyet-dinh-giao-du-toan-chi-NSNN.module'
      ).then((m) => m.NhapQuyetDinhGiaoDuToanChiNSNNModule),
  },
  {
    path: GIAO_DU_TOAN + '/nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC/:id',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/nhap-quyet-dinh-giao-du-toan-chi-NSNN/nhap-quyet-dinh-giao-du-toan-chi-NSNN.module'
      ).then((m) => m.NhapQuyetDinhGiaoDuToanChiNSNNModule),
  },
  {
    path: GIAO_DU_TOAN + '/giao-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/giao-du-toan-chi-NSNN-cho-cac-don-vi/giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.GiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/giao-du-toan-chi-NSNN-cho-cac-don-vi/:id',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/giao-du-toan-chi-NSNN-cho-cac-don-vi/giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.GiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/nhan-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-cuc-khu-vuc/nhan-du-toan-chi-NSNN-cho-cac-don-vi/nhan-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.NhanDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/nhan-du-toan-chi-NSNN-cho-cac-don-vi/:id',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-cuc-khu-vuc/nhan-du-toan-chi-NSNN-cho-cac-don-vi/nhan-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.NhanDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc/kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc.module'
      ).then((m) => m.KiemTraRaSoatPhuongAnTuCucKhuVucModule),
  },
  {
    path: GIAO_DU_TOAN + '/nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.NhapThongTinQdGiaoDieuChinhDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi/nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.NhapThongTinQuyetToanGiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi/tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi.module'
      ).then((m) => m.TimKiemGiaoDuToanChiNSNNCuaCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/tim-kiem-nhan-du-toan-chi-NSNN-cua-cac-don-vi',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-cuc-khu-vuc/tim-kiem-nhan-du-toan-chi-NSNN-cua-cac-don-vi/tim-kiem-nhan-du-toan-chi-NSNN-cua-cac-don-vi.module'
      ).then((m) => m.TimKiemNhanDuToanChiNSNNCuaCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/:id',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/:id/:namDtoan',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViModule),
  },

  {
    path: GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/:id',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/:id/:namDtoan',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: GIAO_DU_TOAN + '/danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan/danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan.module'
      ).then((m) => m.DanhSachDuyetBaoCaoPhanBoGiaoDieuChinhDuToanModule),
  },
  {
    path: GIAO_DU_TOAN + '/duyet-phuong-an-tai-don-vi',
    loadChildren: () =>
      import(
        './giao-du-toan-chi-nsnn/chuc-nang-TCDT/duyet-phuong-an-tai-don-vi/duyet-phuong-an-tai-don-vi.module'
      ).then((m) => m.DuyetPhuongAnTaiDonViModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class DuToanNsnnRoutingModule { }
