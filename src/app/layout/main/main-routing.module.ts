import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MAIN_ROUTES } from './main-routing.constant';
import { MainComponent } from './main.component';
import { ErrorComponent } from './error/error.component';
import { NotAuthenComponent } from './error/not-authen/not-authen.component';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { HtCongCuDungCuComponent } from "../../pages/khoi-tao-du-lieu/ht-cong-cu-dung-cu/ht-cong-cu-dung-cu.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'kehoach',
        pathMatch: 'full',
      },
      {
        path: MAIN_ROUTES.nhap,
        loadChildren: () => import('../../pages/nhap/nhap.module').then((m) => m.NhapModule),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.xuat,
        loadChildren: () =>
          import('../../pages/xuat/xuat.module').then((m) => m.XuatModule),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.dinhMucNhapXuat,
        loadChildren: () =>
          import('../../pages/dinh-muc/dinh-muc.module').then((m) => m.DinhMucModule),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.luuKho,
        loadChildren: () =>
          import('../../pages/luu-kho/luu-kho.module').then((m) => m.LuuKhoModule),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.khcnBaoQuan,
        loadChildren: () =>
          import('../../pages/khkn-bao-quan/khkn-bao-quan.module').then((m) => m.KhknBaoQuanModule),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.quanLyKhoTang,
        loadChildren: () =>
          import('../../pages/quan-ly-kho-tang/quan-ly-kho-tang.module').then((m) => m.QuanLyKhoTangModule),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.khaiThacBaoCao,
        loadChildren: () =>
          import('../../pages/khai-thac-bao-cao/khai-thac-bao-cao.module').then((m) => m.KhaiThacBaoCaoModule),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.baoCaoBoNganh,
        loadChildren: () =>
          import('../../pages/bao-cao-bo-nganh/bao-cao-bo-nganh.module').then((m) => m.BaoCaoBoNganhModule),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.kehoach,
        loadChildren: () =>
          import('../../pages/ke-hoach/ke-hoach.module').then(
            (m) => m.KeHoachModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.danhMuc,
        loadChildren: () =>
          import('../../pages/danh-muc/danh-muc.module').then(
            (m) => m.DanhMucModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.quanTriHeThong,
        loadChildren: () =>
          import('../../pages/quan-tri-he-thong/quan-tri-he-thong.module').then(
            (m) => m.QuanTriHeThongNewModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.capVon,
        loadChildren: () =>
          import('../../pages/quan-ly-ke-hoach-cap-von-phi-hang/quan-ly-ke-hoach-von-phi-hang.module').then(
            (m) => m.QuanLyKeHoachVonPhiHangModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.quyetToan,
        loadChildren: () =>
          import('../../pages/quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg/quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg.module').then(
            (m) => m.QuanLyThongTinQuyetToanVonPhiHangDtqgModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.quanTriDanhMuc,
        loadChildren: () =>
          import('../../pages/quan-tri-danh-muc/quantridanhmuc.module').then(
            (m) => m.QuanTriDanhMucModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.suaChua,
        loadChildren: () =>
          import('../../pages/sua-chua/sua-chua.module').then((m) => m.SuaChuaModule),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.dieuChuyenNoiBo,
        loadChildren: () =>
          import('../../pages/dieu-chuyen-noi-bo/dieu-chuyen-noi-bo.module').then((m) => m.DieuChuyenNoiBoModule),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.khoiTaoDuLieu,
        loadChildren: () =>
          import('../../pages/khoi-tao-du-lieu/khoi-tao-du-lieu.module').then((m) => m.KhoiTaoDuLieuModule),
        canActivate: [AuthGuard],
      },
      {
        path: MAIN_ROUTES.troGiup,
        loadChildren: () =>
          import('../../pages/tro-giup/tro-giup.module').then((m) => m.TroGiupModule),
        canActivate: [AuthGuard],
      }
    ],
  },
  {
    path: 'error',
    component: ErrorComponent,
    children: [
      {
        path: '401',
        component: NotAuthenComponent
      },
      {
        path: '404',
        component: NotFoundComponent
      }
    ]
  },
  { path: '**', redirectTo: '/error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {
}
