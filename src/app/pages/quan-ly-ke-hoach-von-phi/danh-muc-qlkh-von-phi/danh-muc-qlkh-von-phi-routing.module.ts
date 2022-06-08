import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhMucQlkhVonPhiComponent } from './danh-muc-qlkh-von-phi.component';

const routes: Routes = [
  {
    path: '',
    component: DanhMucQlkhVonPhiComponent,
  },
  {
    path: 'danh-sach-danh-muc-goc',
    loadChildren: () =>
      import(
        './danh-sach-danh-muc-goc/danh-sach-danh-muc-goc.module'
      ).then((m) => m.DanhSachDanhMucGocModule),
  },
  {
    path: 'danh-sach-danh-muc-goc/:id',
    loadChildren: () =>
      import(
        './danh-sach-danh-muc-goc/danh-sach-danh-muc-goc.module'
      ).then((m) => m.DanhSachDanhMucGocModule),
  },
//   {
//     path: 'tong-hop',
//     loadChildren: () =>
//       import(
//         './tim-kiem/tim-kiem.module'
//       ).then((m) => m.TimKiemModule),
//   },
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
//   {
//     path: 'danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-btc',
//     loadChildren: () =>
//       import(
//         './btc/ghi-nhan-thong-tin-nhan-tien-von-vmvu/danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu/danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu.module'
//       ).then((m) => m.DanhSachGhiNhanThongTinNhanTienVonVmvuTuBtcModule),
//   },

//   {
//     path: 'ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-btc',
//     loadChildren: () =>
//       import(
//         './btc/ghi-nhan-thong-tin-nhan-tien-von-vmvu/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-btc/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-btc.module'
//       ).then((m) => m.GhiNhanThongTinNhanTienVonVmvuTuBtcModule),
//   },
//   {
//     path: 'ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-btc/:id',
//     loadChildren: () =>
//       import(
//         './btc/ghi-nhan-thong-tin-nhan-tien-von-vmvu/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-btc/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-btc.module'
//       ).then((m) => m.GhiNhanThongTinNhanTienVonVmvuTuBtcModule),
//   },
//   /////////////////////////////////////////////////////////////////////////////////////////////////////
//   {
//     path: 'danh-sach-cap-von-cho-cuc-dtnn-khu-vuc',
//     loadChildren: () =>
//       import(
//         './cuc-dtnn-khu-vuc/nhap-thong-tin-cap-tien-von-mua-hang-con-ung-cho-cuc-dtnn-kv/danh-sach-cap-von/danh-sach-cap-von.module'
//       ).then((m) => m.DanhSachCapVonModule),
//   },
//   {
//     path: 'nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-cuc-dtnn-khu-vuc',
//     loadChildren: () =>
//       import(
//         './cuc-dtnn-khu-vuc/nhap-thong-tin-cap-tien-von-mua-hang-con-ung-cho-cuc-dtnn-kv/nhap-thong-tin-cap-tien-von-mua-hang-von-ung/nhap-thong-tin-cap-tien-von-mua-hang-von-ung.module'
//       ).then((m) => m.NhapThongTinCapTienVonMuaHangVonUngModule),
//   },
//   {
//     path: 'nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-cuc-dtnn-khu-vuc/:id',
//     loadChildren: () =>
//       import(
//         './cuc-dtnn-khu-vuc/nhap-thong-tin-cap-tien-von-mua-hang-con-ung-cho-cuc-dtnn-kv/nhap-thong-tin-cap-tien-von-mua-hang-von-ung/nhap-thong-tin-cap-tien-von-mua-hang-von-ung.module'
//       ).then((m) => m.NhapThongTinCapTienVonMuaHangVonUngModule),
//   },
//   /////////////////////////////////////////////////////////////////////////////////////////////////////
//   {
//     path: 'danh-sach-ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc',
//     loadChildren: () =>
//       import(
//         './cuc-dtnn-khu-vuc/ghi-nhan-thong-tin-nhan-tien-von-ban-hang/danh-sach-ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc/danh-sach-ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc.module'
//       ).then((m) => m.DanhSachGhiNhanThongTinNhanTienVonVonBanHangTuCucDtnnKhuVucModule),
//   },
//   {
//     path: 'ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc',
//     loadChildren: () =>
//       import(
//         './cuc-dtnn-khu-vuc/ghi-nhan-thong-tin-nhan-tien-von-ban-hang/ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc/ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc.module'
//       ).then((m) => m.GhiNhanThongTinNhanTienVonBanHangTuCucDtnnKhuVucModule),
//   },
//   {
//     path: 'ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc/:id',
//     loadChildren: () =>
//       import(
//         './cuc-dtnn-khu-vuc/ghi-nhan-thong-tin-nhan-tien-von-ban-hang/ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc/ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-cuc-dtnn-khu-vuc.module'
//       ).then((m) => m.GhiNhanThongTinNhanTienVonBanHangTuCucDtnnKhuVucModule),
//   },
//   /////////////////////////////////////////////////////////////////////////////////////////////////////
//   {
//     path: 'danh-sach-thong-tin-nop-tien-von-ban-hang-len-btc',
//     loadChildren: () =>
//       import(
//         './btc/nhap-thong-tin-nop-tien-von-ban-hang/danh-sach-thong-tin-nop-tien-von-ban-hang-len-btc/danh-sach-thong-tin-nop-tien-von-ban-hang-len-btc.module'
//       ).then((m) => m.DanhSachThongTinNopTienVonBanHangLenBtcModule),
//   },
//   {
//     path: 'nhap-thong-tin-nop-tien-von-ban-hang-len-btc',
//     loadChildren: () =>
//       import(
//         './btc/nhap-thong-tin-nop-tien-von-ban-hang/nhap-thong-tin-nop-tien-von-ban-hang-len-btc/nhap-thong-tin-nop-tien-von-ban-hang-len-btc.module'
//       ).then((m) => m.NhapThongTinNopTienVonBanHangLenBtcModule),
//   },
//   {
//     path: 'nhap-thong-tin-nop-tien-von-ban-hang-len-btc/:id',
//     loadChildren: () =>
//       import(
//         './btc/nhap-thong-tin-nop-tien-von-ban-hang/nhap-thong-tin-nop-tien-von-ban-hang-len-btc/nhap-thong-tin-nop-tien-von-ban-hang-len-btc.module'
//       ).then((m) => m.NhapThongTinNopTienVonBanHangLenBtcModule),
//   },
//   /////////////////////////////////////////////////////////////////////////////////////////////////////
//   {
//     path: 'danh-sach-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc',
//     loadChildren: () =>
//       import(
//         './tong-cuc-dtnn/thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang/danh-sach-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc/danh-sach-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc.module'
//       ).then((m) => m.DanhSachThanhToanTienVonMuaHangChoKhachHangTaiTongCucModule),
//   },
//   {
//     path: 'thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc',
//     loadChildren: () =>
//       import(
//         './tong-cuc-dtnn/thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang/thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc/thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc.module'
//       ).then((m) => m.ThucHienThanhToanTienVonMuaHangChoKhachHangTaiTongCucModule),
//   },
//   {
//     path: 'thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc/:id',
//     loadChildren: () =>
//       import(
//         './tong-cuc-dtnn/thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang/thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc/thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc.module'
//       ).then((m) => m.ThucHienThanhToanTienVonMuaHangChoKhachHangTaiTongCucModule),
//   },
//   /////////////////////////////////////////////////////////////////////////////////////////////////////
//   {
//     path: 'danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn',
//     loadChildren: () =>
//       import(
//         './tong-cuc-dtnn/ghi-nhan-thong-tin-nhan-tien-von-vmvu/danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn/danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn.module'
//       ).then((m) => m.DanhSachGhiNhanThongTinNhanTienVonVmvuTaiTongCucDtnnModule),
//   },
//   {
//     path: 'ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn',
//     loadChildren: () =>
//       import(
//         './tong-cuc-dtnn/ghi-nhan-thong-tin-nhan-tien-von-vmvu/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn.module'
//       ).then((m) => m.GhiNhanThongTinNhanTienVonVmvuTuTongCucDtnnModule),
//   },
//   {
//     path: 'ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn/:id',
//     loadChildren: () =>
//       import(
//         './tong-cuc-dtnn/ghi-nhan-thong-tin-nhan-tien-von-vmvu/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-tong-cuc-dtnn.module'
//       ).then((m) => m.GhiNhanThongTinNhanTienVonVmvuTuTongCucDtnnModule),
//   },
//   /////////////////////////////////////////////////////////////////////////////////////////////////////
//   {
//     path: 'danh-sach-ghi-nhan-thong-tin-tien-von-ban-hang-tu-chi-cuc-dtnn',
//     loadChildren: () =>
//       import(
//         './chi-cuc-dtnn/ghi-nhan-thong-tin-nhan-tien-von-ban-hang/danh-sach-ghi-nhan-thong-tin-tien-von-ban-hang-tu-chi-cuc-dtnn/danh-sach-ghi-nhan-thong-tin-tien-von-ban-hang-tu-chi-cuc-dtnn.module'
//       ).then((m) => m.DanhSachGhiNhanThongTinTienVonVonBanHangTuChiCucDtnnModule),
//   },
//   {
//     path: 'ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-chi-cuc-dtnn',
//     loadChildren: () =>
//       import(
//         './chi-cuc-dtnn/ghi-nhan-thong-tin-nhan-tien-von-ban-hang/ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-chi-cuc-dtnn/ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-chi-cuc-dtnn.module'
//       ).then((m) => m.GhiNhanThongTinNhanTienVonBanHangTuChiCucDtnnModule),
//   },
//   {
//     path: 'ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-chi-cuc-dtnn/:id',
//     loadChildren: () =>
//       import(
//         './chi-cuc-dtnn/ghi-nhan-thong-tin-nhan-tien-von-ban-hang/ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-chi-cuc-dtnn/ghi-nhan-thong-tin-nhan-tien-von-ban-hang-tu-chi-cuc-dtnn.module'
//       ).then((m) => m.GhiNhanThongTinNhanTienVonBanHangTuChiCucDtnnModule),
//   },
//   /////////////////////////////////////////////////////////////////////////////////////////////////////
//   {
//     path: 'danh-sach-thong-tin-nop-tien-von-ban-hang-len-tong-cuc',
//     loadChildren: () =>
//       import(
//         './tong-cuc-dtnn/nhap-thong-tin-nop-tien-von-ban-hang/danh-sach-thong-tin-nop-tien-von-ban-hang-len-tong-cuc/danh-sach-thong-tin-nop-tien-von-ban-hang-len-tong-cuc.module'
//       ).then((m) => m.DanhSachThongTinNopTienVonBanHangLenTongCucModule),
//   },
//   {
//     path: 'nhap-thong-tin-nop-tien-von-ban-hang-len-tong-cuc',
//     loadChildren: () =>
//       import(
//         './tong-cuc-dtnn/nhap-thong-tin-nop-tien-von-ban-hang/nhap-thong-tin-nop-tien-von-ban-hang-len-tong-cuc/nhap-thong-tin-nop-tien-von-ban-hang-len-tong-cuc.module'
//       ).then((m) => m.NhapThongTinNopTienVonBanHangLenTongCucModule),
//   },
//   {
//     path: 'nhap-thong-tin-nop-tien-von-ban-hang-len-tong-cuc/:id',
//     loadChildren: () =>
//       import(
//         './tong-cuc-dtnn/nhap-thong-tin-nop-tien-von-ban-hang/nhap-thong-tin-nop-tien-von-ban-hang-len-tong-cuc/nhap-thong-tin-nop-tien-von-ban-hang-len-tong-cuc.module'
//       ).then((m) => m.NhapThongTinNopTienVonBanHangLenTongCucModule),
//   },
//   ///////////////////////////////////////////////////////////////////////////////////////////////////////
//   {
//     path: 'danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc',
//     loadChildren: () =>
//       import(
//         './cuc-dtnn-khu-vuc/ghi-nhan-thong-tin-nhan-tien-von-vmvu/danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc/danh-sach-ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc.module'
//       ).then((m) => m.DanhSachGhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucModule),
//   },
//   {
//     path: 'ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc',
//     loadChildren: () =>
//       import(
//         './cuc-dtnn-khu-vuc/ghi-nhan-thong-tin-nhan-tien-von-vmvu/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc.module'
//       ).then((m) => m.GhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucModule),
//   },
//   {
//     path: 'ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc/:id',
//     loadChildren: () =>
//       import(
//         './cuc-dtnn-khu-vuc/ghi-nhan-thong-tin-nhan-tien-von-vmvu/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc/ghi-nhan-thong-tin-nhan-tien-von-vmvu-tu-cuc-dtnn-khu-vuc.module'
//       ).then((m) => m.GhiNhanThongTinNhanTienVonVmvuTuCucDtnnKhuVucModule),
//   },
//   /////////////////////////////////////////////////////////////////////////////////////////////////////////
//   {
//     path: 'danh-sach-nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn',
//     loadChildren: () =>
//       import(
//         './chi-cuc-dtnn/nhap-thong-tin-cap-tien-von-mua-hang-von-ung/danh-sach-nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn/danh-sach-nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn.module'
//       ).then((m) => m.DanhSachNhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnModule),
//   },
//   {
//     path: 'nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn',
//     loadChildren: () =>
//       import(
//         './chi-cuc-dtnn/nhap-thong-tin-cap-tien-von-mua-hang-von-ung/nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn/nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn.module'
//       ).then((m) => m.NhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnModule),
//   },
//   {
//     path: 'nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn/:id',
//     loadChildren: () =>
//       import(
//         './chi-cuc-dtnn/nhap-thong-tin-cap-tien-von-mua-hang-von-ung/nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn/nhap-thong-tin-cap-tien-von-mua-hang-von-ung-cho-chi-cuc-dtnn.module'
//       ).then((m) => m.NhapThongTinCapTienVonMuaHangVonUngChoChiCucDtnnModule),
//   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhMucQlkhVonPhiRoutingModule {}
