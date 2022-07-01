import { KeHoachModule } from './../../pages/ke-hoach/ke-hoach.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from 'src/app/pages/index/index.component';
import { MAIN_ROUTES } from './main-routing.constant';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'kehoach',
        pathMatch: 'full',
      },
      {
        path: MAIN_ROUTES.nhap,
        loadChildren: () =>
          import('../../pages/nhap/nhap.module').then((m) => m.NhapModule),
      },
      {
        path: MAIN_ROUTES.nhapKhac,
        loadChildren: () =>
          import('../../pages/nhap-khac/nhap-khac.module').then((m) => m.NhapKhacModule),
      },
      {
        path: MAIN_ROUTES.xuat,
        loadChildren: () =>
          import('../../pages/xuat/xuat.module').then((m) => m.XuatModule),
      },
      {
        path: MAIN_ROUTES.xuatKhac,
        loadChildren: () =>
          import('../../pages/xuat-khac/xuat-khac.module').then((m) => m.XuatKhacModule),
      },
      {
        path: MAIN_ROUTES.dinhMucNhapXuat,
        loadChildren: () =>
          import('../../pages/dinh-muc/dinh-muc.module').then((m) => m.DinhMucModule),
      },
      {
        path: MAIN_ROUTES.muaHang,
        loadChildren: () =>
          import('../../pages/mua-hang/mua-hang.module').then((m) => m.MuaHangModule),
      },
      {
        path: MAIN_ROUTES.luuKho,
        loadChildren: () =>
          import('../../pages/luu-kho/luu-kho.module').then((m) => m.LuuKhoModule),
      },
      {
        path: MAIN_ROUTES.banHang,
        loadChildren: () =>
          import('../../pages/ban-hang/ban-hang.module').then((m) => m.BanHangModule),
      },
      {
        path: MAIN_ROUTES.khknBaoQuan,
        loadChildren: () =>
          import('../../pages/khkn-bao-quan/khkn-bao-quan.module').then((m) => m.KhknBaoQuanModule),
      },
      {
        path: MAIN_ROUTES.quanLyKhoTang,
        loadChildren: () =>
          import('../../pages/quan-ly-kho-tang/quan-ly-kho-tang.module').then((m) => m.QuanLyKhoTangModule),
      },
      {
        path: MAIN_ROUTES.kehoach,
        loadChildren: () =>
          import('../../pages/ke-hoach/ke-hoach.module').then(
            (m) => m.KeHoachModule,
          ),
      },
      {
        path: MAIN_ROUTES.danhMuc,
        loadChildren: () =>
          import('../../pages/danh-muc/danh-muc.module').then(
            (m) => m.DanhMucModule,
          ),
      },
      {
        path: MAIN_ROUTES.quantrihethong,
        loadChildren: () =>
          import('../../pages/quantrihethong/quantrihethong.module').then(
            (m) => m.QuanTriHeThongModule,
          ),
      },
      {
        path: MAIN_ROUTES.qlkhVonPhi,
        loadChildren: () =>
          import('../../pages/quan-ly-ke-hoach-von-phi/quan-ly-ke-hoach-von-phi.module').then(
            (m) => m.QuanLyKeHoachVonPhiModule,
          ),
      },
      {
        path: MAIN_ROUTES.qlcapVonPhi,
        loadChildren: () => 
          import('../../pages/quan-ly-ke-hoach-cap-von-phi-hang/quan-ly-ke-hoach-von-phi-hang.module').then(
            (m) => m.QuanLyKeHoachVonPhiHangModule,
          ),
      },
      {
        path: MAIN_ROUTES.qlthongTinQuyetToanVonPhi,
        loadChildren: () =>
          import('../../pages/quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg/quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg.module').then(
            (m) => m.QuanLyThongTinQuyetToanVonPhiHangDtqgModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
