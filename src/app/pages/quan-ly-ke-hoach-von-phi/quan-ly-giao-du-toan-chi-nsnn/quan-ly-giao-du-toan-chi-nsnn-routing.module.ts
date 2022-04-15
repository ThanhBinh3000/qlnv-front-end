import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyGiaoDuToanChiNSNNComponent } from './quan-ly-giao-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyGiaoDuToanChiNSNNComponent,
  },
  {
    path: 'tim-kiem',
    loadChildren: () =>
      import(
        './tim-kiem/tim-kiem.module'
      ).then((m) => m.TimKiemModule),
  },
  {
    path: 'tong-hop',
    loadChildren: () =>
      import(
        './tim-kiem/tim-kiem.module'
      ).then((m) => m.TimKiemModule),
  },
  {
    path: 'nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd/nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd.module'
      ).then((m) => m.NhapQuyetDinhGiaoDuToanChiNsnnBtcPdModule),
  },
  {
    path: 'nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd/nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd.module'
      ).then((m) => m.NhapQuyetDinhGiaoDuToanChiNsnnBtcPdModule),
  },
  {
    path: 'danh-sach-ke-hoach-phan-bo-ngan-sach',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/danh-sach-ke-hoach-phan-bo-ngan-sach/danh-sach-ke-hoach-phan-bo-ngan-sach.module'
      ).then((m) => m.DanhSachKeHoachPhanBoNganSachModule),
  },
  {
    path: 'danh-sach-ke-hoach-phan-bo-ngan-sach/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/danh-sach-ke-hoach-phan-bo-ngan-sach/danh-sach-ke-hoach-phan-bo-ngan-sach.module'
      ).then((m) => m.DanhSachKeHoachPhanBoNganSachModule),
  },
  {
    path: 'lap-du-toan-chi-ngan-sach-cho-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/lap-du-toan-chi-ngan-sach-cho-don-vi/lap-du-toan-chi-ngan-sach-cho-don-vi.module'
      ).then((m) => m.LapDuToanChiNganSachChoDonViModule),
  },
  {
    path: 'lap-du-toan-chi-ngan-sach-cho-don-vi/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/lap-du-toan-chi-ngan-sach-cho-don-vi/lap-du-toan-chi-ngan-sach-cho-don-vi.module'
      ).then((m) => m.LapDuToanChiNganSachChoDonViModule),
  },
  {
    path: 'bao-cao-tong-cuc-khoach-phan-bo',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/lap-bao-cao-tong-hop-phan-bo-chi-NSNN-gui-tong-cuc/bao-cao-tong-cuc-khoach-phan-bo.module'
      ).then((m) => m.BaoCaoTongCucKhoachPhanBoModule),
  },
  {
    path: 'bao-cao-tong-cuc-khoach-phan-bo/:id',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/lap-bao-cao-tong-hop-phan-bo-chi-NSNN-gui-tong-cuc/bao-cao-tong-cuc-khoach-phan-bo.module'
      ).then((m) => m.BaoCaoTongCucKhoachPhanBoModule),
  },
  {
    path: 'lap-phuong-an-phan-bo-du-toan-chi-nsnn-cho-dvi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/lap-phuong-an-phan-bo-du-toan-chi-nsnn-cho-dvi/lap-phuong-an-phan-bo-du-toan-chi-nsnn-cho-dvi.module'
      ).then((m) => m.LapPhuongAnPhanBoDuToanChiNsnnChoDviModule),
  },
  {
    path: 'lap-phuong-an-phan-bo-du-toan-chi-nsnn-cho-dvi/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/lap-phuong-an-phan-bo-du-toan-chi-nsnn-cho-dvi/lap-phuong-an-phan-bo-du-toan-chi-nsnn-cho-dvi.module'
      ).then((m) => m.LapPhuongAnPhanBoDuToanChiNsnnChoDviModule),
  },
  {
    path: 'ds-khoach-pbo-giao-dtoan-cho-chi-cucDTNN-vpCuc',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/ds-khoach-pbo-giao-dtoan-cho-chi-cucDTNN-vpCuc/ds-khoach-pbo-giao-dtoan-cho-chi-cucDTNN-vpCuc.module'
      ).then((m) => m.DsKhoachPboGiaoDtoanChoChiCucDTNNVpCucModule),
  },
  {
    path: 'ds-khoach-pbo-giao-dtoan-cho-chi-cucDTNN-vpCuc/:id',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/ds-khoach-pbo-giao-dtoan-cho-chi-cucDTNN-vpCuc/ds-khoach-pbo-giao-dtoan-cho-chi-cucDTNN-vpCuc.module'
      ).then((m) => m.DsKhoachPboGiaoDtoanChoChiCucDTNNVpCucModule),
  },
  {
    path: 'lap-khoach-pb-giao-dtoan-cho-chi-cucDTNN-vpCuc',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/lap-khoach-pb-giao-dtoan-cho-chi-cucDTNN-vpCuc/lap-khoach-pb-giao-dtoan-cho-chi-cucDTNN-vpCuc.module'
      ).then((m) => m.LapKhoachPbGiaoDtoanChoChiCucDTNNVpCucModule),
  },
  {
    path: 'lap-khoach-pb-giao-dtoan-cho-chi-cucDTNN-vpCuc/:id',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/lap-khoach-pb-giao-dtoan-cho-chi-cucDTNN-vpCuc/lap-khoach-pb-giao-dtoan-cho-chi-cucDTNN-vpCuc.module'
      ).then((m) => m.LapKhoachPbGiaoDtoanChoChiCucDTNNVpCucModule),
  },
  {
    path: 'ds-quyet-dinh',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/ds-quyet-dinh-giao-du-toan-chi-NSNN-do-TCDT-ban-hanh/ds-quyet-dinh.module'
      ).then((m) => m.DsQuyetDinhModule),
  },
  {
    path: 'ds-quyet-dinh/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/ds-quyet-dinh-giao-du-toan-chi-NSNN-do-TCDT-ban-hanh/ds-quyet-dinh.module'
      ).then((m) => m.DsQuyetDinhModule),
  },
  {
    path: 'nhap-qdinh-pbo-giao-dtoan-chi-nsnn',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-qdinh-pbo-giao-dtoan-chi-nsnn/nhap-qdinh-pbo-giao-dtoan-chi-nsnn.module'
      ).then((m) => m.NhapQdinhPboGiaoDtoanChiNsnnModule),
  },
  {
    path: 'nhap-qdinh-pbo-giao-dtoan-chi-nsnn/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-qdinh-pbo-giao-dtoan-chi-nsnn/nhap-qdinh-pbo-giao-dtoan-chi-nsnn.module'
      ).then((m) => m.NhapQdinhPboGiaoDtoanChiNsnnModule),
  },
  {
    path: 'dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc/dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.module'
      ).then((m) => m.DsachTongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcModule),
  },
  {
    path: 'dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc/:id',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc/dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.module'
      ).then((m) => m.DsachTongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcModule),
  },
  {
    path: 'tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc/tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.module'
      ).then((m) => m.TongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcModule),
  },
  {
    path: 'tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc/tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.module'
      ).then((m) => m.TongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcModule),
  },
  {
    path: 'nhan-ghi-nhan-thong-tin-pbo-du-an',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/nhan-ghi-nhan-thong-tin-pbo-du-an/nhan-ghi-nhan-thong-tin-pbo-du-an.module'
      ).then((m) => m.NhanGhiNhanThongTinPboDuAnModule),
  },
  {
    path: 'nhan-ghi-nhan-thong-tin-pbo-du-an/:id',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/nhan-ghi-nhan-thong-tin-pbo-du-an/nhan-ghi-nhan-thong-tin-pbo-du-an.module'
      ).then((m) => m.NhanGhiNhanThongTinPboDuAnModule),
  },
  {
    path: 'danh-sach-bao-cao',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/danh-sach-bao-cao-phan-bo-giao-du-toan-gui-tong-cuc/danh-sach-bao-cao.module'
      ).then((m) => m.DanhSachBaoCaoModule),
  },
  {
    path: 'danh-sach-bao-cao/:id',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/danh-sach-bao-cao-phan-bo-giao-du-toan-gui-tong-cuc/danh-sach-bao-cao.module'
      ).then((m) => m.DanhSachBaoCaoModule),
  },
  {
    path: 'ds-khoach-pbo-giao-dtoan-cho-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/ds-khoach-pbo-giao-dtoan-cho-don-vi/ds-khoach-pbo-giao-dtoan-cho-don-vi.module'
      ).then((m) => m.DsKhoachPboGiaoDtoanChoDonViModule),
  },
  {
    path: 'ds-khoach-pbo-giao-dtoan-cho-don-vi/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/ds-khoach-pbo-giao-dtoan-cho-don-vi/ds-khoach-pbo-giao-dtoan-cho-don-vi.module'
      ).then((m) => m.DsKhoachPboGiaoDtoanChoDonViModule),
  },
  {
    path: 'ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN/ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN.module'
      ).then((m) => m.DsKhoachPboGiaoDtoanChoChiCucDTNNModule),
  },
  {
    path: 'ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN/:id',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN/ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN.module'
      ).then((m) => m.DsKhoachPboGiaoDtoanChoChiCucDTNNModule),
  },
  {
    path: 'lap-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/lap-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN/lap-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN.module'
      ).then((m) => m.LapKhoachPboGiaoDtoanChoChiCucDTNNModule),
  },
  {
    path: 'lap-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN/:id',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/lap-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN/lap-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN.module'
      ).then((m) => m.LapKhoachPboGiaoDtoanChoChiCucDTNNModule),
  },
  {
    path: 'ds-nhan-ghi-nhan-thong-tin-pbo-du-toan',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/ds-nhan-ghi-nhan-thong-tin-pbo-du-toan/ds-nhan-ghi-nhan-thong-tin-pbo-du-toan.module'
      ).then((m) => m.DsNhanGhiNhanThongTinPboDuAnModule),
  },
  {
    path: 'ds-nhan-ghi-nhan-thong-tin-pbo-du-toan/:id',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/ds-nhan-ghi-nhan-thong-tin-pbo-du-toan/ds-nhan-ghi-nhan-thong-tin-pbo-du-toan.module'
      ).then((m) => m.DsNhanGhiNhanThongTinPboDuAnModule),
  },
  {
    path: 'nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi/nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi.module'
      ).then((m) => m.NhapQuyetDinhCuaTongCucVaPhanBoChoCacDonViModule),
  },
  {
    path: 'nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi/nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi.module'
      ).then((m) => m.NhapQuyetDinhCuaTongCucVaPhanBoChoCacDonViModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyGiaoDuToanChiNSNNRoutingModule {}
