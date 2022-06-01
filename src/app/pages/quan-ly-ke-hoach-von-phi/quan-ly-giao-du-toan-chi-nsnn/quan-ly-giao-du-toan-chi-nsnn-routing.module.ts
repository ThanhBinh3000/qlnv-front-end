import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyGiaoDuToanChiNSNNComponent } from './quan-ly-giao-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyGiaoDuToanChiNSNNComponent,
  },
  {
    path: 'tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN/tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN.module'
      ).then((m) => m.TimKiemQuyetDinhNhapDuToanChiNSNNModule),
  },
  {
    path: 'tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: 'nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-quyet-dinh-giao-du-toan-chi-NSNN/nhap-quyet-dinh-giao-du-toan-chi-NSNN.module'
      ).then((m) => m.NhapQuyetDinhGiaoDuToanChiNSNNModule),
  },
  {
    path: 'nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC/:id',
    loadChildren: () =>
    import(
      './chuc-nang-TCDT/nhap-quyet-dinh-giao-du-toan-chi-NSNN/nhap-quyet-dinh-giao-du-toan-chi-NSNN.module'
      ).then((m) => m.NhapQuyetDinhGiaoDuToanChiNSNNModule),
  },
  {
    path: 'giao-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/giao-du-toan-chi-NSNN-cho-cac-don-vi/giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.GiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: 'kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc/kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc.module'
      ).then((m) => m.KiemTraRaSoatPhuongAnTuCucKhuVucModule),
  },
  {
    path: 'nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.NhapThongTinQdGiaoDieuChinhDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: 'nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi/nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.NhapThongTinQuyetToanGiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: 'tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi/tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi.module'
      ).then((m) => m.TimKiemGiaoDuToanChiNSNNCuaCacDonViModule),
  },
  {
    path: 'tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi/tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: 'tong-hop-lap-ke-hoach-phan-bo-du-toan-cua-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/tong-hop-lap-ke-hoach-phan-bo-du-toan-cua-don-vi/tong-hop-lap-ke-hoach-phan-bo-du-toan-cua-don-vi.module'
      ).then((m) => m.TongHopLapKeHoachPhanBoDuToanCuaDonViModule),
  },
  {
    path: 'xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViModule),
  },
  {
    path: 'xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi.module'
      ).then((m) => m.XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViModule),
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyGiaoDuToanChiNSNNRoutingModule {}
