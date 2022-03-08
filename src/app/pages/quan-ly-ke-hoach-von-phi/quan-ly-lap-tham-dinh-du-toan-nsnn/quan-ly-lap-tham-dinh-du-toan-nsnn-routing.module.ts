import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyLapThamDinhDuToanNSNNComponent } from './quan-ly-lap-tham-dinh-du-toan-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyLapThamDinhDuToanNSNNComponent,
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
        './tong-hop/tong-hop.module'
      ).then((m) => m.TonghopModule),
  },
  {
    path: 'chi-thuong-xuyen-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-thuong-xuyen-3-nam/chi-thuong-xuyen-3-nam.module'
      ).then((m) => m.ChiThuongXuyen3NamModule),
  },
  {
    path: 'chi-thuong-xuyen-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-thuong-xuyen-3-nam/chi-thuong-xuyen-3-nam.module'
      ).then((m) => m.ChiThuongXuyen3NamModule),
  },
  {
//<<<<<<< HEAD
    path: 'ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam.module'
      ).then((m) => m.KeHoachXayDungVanBanQpplDtqg3NamModule),
  },
  {
    path: 'ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam.module'
      ).then((m) => m.KeHoachXayDungVanBanQpplDtqg3NamModule),
  },
  {
    path: 'du-toan-chi-ung-dung-cntt-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/du-toan-chi-ung-dung-cntt-3-nam/du-toan-chi-ung-dung-cntt-3-nam.module'
      ).then((m) => m.DuToanChiUngDungCntt3NamModule),
  },
  {
    path: 'du-toan-chi-ung-dung-cntt-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/du-toan-chi-ung-dung-cntt-3-nam/du-toan-chi-ung-dung-cntt-3-nam.module'
      ).then((m) => m.DuToanChiUngDungCntt3NamModule),
  },
  {
    path: 'chi-mua-sam-thiet-bi-chuyen-dung-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-mua-sam-thiet-bi-chuyen-dung-3-nam/chi-mua-sam-thiet-bi-chuyen-dung-3-nam.module'
      ).then((m) => m.ChiMuaSamThietBiChuyenDung3NamModule),
  },
  {
    path: 'chi-mua-sam-thiet-bi-chuyen-dung-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-mua-sam-thiet-bi-chuyen-dung-3-nam/chi-mua-sam-thiet-bi-chuyen-dung-3-nam.module'
      ).then((m) => m.ChiMuaSamThietBiChuyenDung3NamModule),
  },
  {
    path: 'chi-ngan-sach-nha-nuoc-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-ngan-sach-nha-nuoc-3-nam/chi-ngan-sach-nha-nuoc-3-nam.module'
      ).then((m) => m.ChiNganSachNhaNuoc3NamModule),
  },
  {
    path: 'chi-ngan-sach-nha-nuoc-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-ngan-sach-nha-nuoc-3-nam/chi-ngan-sach-nha-nuoc-3-nam.module'
      ).then((m) => m.ChiNganSachNhaNuoc3NamModule),
  },
  {
    path: 'nhu-cau-phi-nhap-xuat-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-phi-nhap-xuat-3-nam/nhu-cau-phi-nhap-xuat-3-nam.module'
      ).then((m) => m.NhuCauPhiNhapXuat3NamModule),
  },
  {
    path: 'nhu-cau-phi-nhap-xuat-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/nhu-cau-phi-nhap-xuat-3-nam/nhu-cau-phi-nhap-xuat-3-nam.module'
      ).then((m) => m.NhuCauPhiNhapXuat3NamModule),
  },
  {
    path: 'ke-hoach-cai-tao-va-sua-chua-lon-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-cai-tao-va-sua-chua-lon-3-nam/ke-hoach-cai-tao-va-sua-chua-lon-3-nam.module'
      ).then((m) => m.KeHoachCaiTaoVaSuaChuaLon3NamModule),
  },
  {
    path: 'ke-hoach-cai-tao-va-sua-chua-lon-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-cai-tao-va-sua-chua-lon-3-nam/ke-hoach-cai-tao-va-sua-chua-lon-3-nam.module'
      ).then((m) => m.KeHoachCaiTaoVaSuaChuaLon3NamModule),
  },
  {
    path: 'ke-hoach-dao-tao-boi-duong-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-dao-tao-boi-duong-3-nam/ke-hoach-dao-tao-boi-duong-3-nam.module'
      ).then((m) => m.KeHoachDaoTaoBoiDuong3NamModule),
  },
  {
    path: 'ke-hoach-dao-tao-boi-duong-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ke-hoach-dao-tao-boi-duong-3-nam/ke-hoach-dao-tao-boi-duong-3-nam.module'
      ).then((m) => m.KeHoachDaoTaoBoiDuong3NamModule),
  },
  {
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },
  {
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },
  {
    path:'tong-hop-du-toan-chi-thuong-xuyen-hang-nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/tong-hop-du-toan-chi-thuong-xuyen-hang-nam/tong-hop-du-toan-chi-thuong-xuyen-hang-nam.module'
      ).then((m) => m.TongHopDuToanChiThuongXuyenHangNamModule),
  },
  {
    path:'tong-hop-du-toan-chi-thuong-xuyen-hang-nam/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/tong-hop-du-toan-chi-thuong-xuyen-hang-nam/tong-hop-du-toan-chi-thuong-xuyen-hang-nam.module'
      ).then((m) => m.TongHopDuToanChiThuongXuyenHangNamModule),
  },

  {
    path:'du-toan-phi-xuat-hang-dtqg-hang-nam-vtct',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.module'
      ).then((m) => m.DuToanPhiNhapXuatDtqgHangNamVtctModule),
  },
  {
    path:'du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.module'
      ).then((m) => m.DuToanPhiNhapXuatDtqgHangNamVtctModule),
  },

  {
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  }
//>>>>>>> 773303aecd27b8173b6e284f7910b6b9a4702b15
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyLapThamDinhDuToanNSNNRoutingModule {}
