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
        path: MAIN_ROUTES.xuat,
        loadChildren: () =>
          import('../../pages/xuat/xuat.module').then((m) => m.XuatModule),
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
        path: MAIN_ROUTES.dieuChuyenNoiBo,
        loadChildren: () =>
          import('../../pages/dieu-chuyen-noi-bo/dieu-chuyen-noi-bo.module').then((m) => m.DieuChuyenNoiBoModule),
      },
      {
        path: MAIN_ROUTES.kiemTraChatLuong,
        loadChildren: () =>
          import('../../pages/kiem-tra-chat-luong/kiem-tra-chat-luong.module').then((m) => m.KiemTraChatLuongModule),
      },
      {
        path: MAIN_ROUTES.suaChua,
        loadChildren: () =>
          import('../../pages/sua-chua/sua-chua.module').then((m) => m.SuaChuaModule),
      },
      {
        path: MAIN_ROUTES.thanhLyTieuHuy,
        loadChildren: () =>
          import('../../pages/thanh-ly-tieu-huy/thanh-ly-tieu-huy.module').then((m) => m.ThanhLyTieuHuyModule),
      },
      {
        path: MAIN_ROUTES.quanLyChatLuong,
        loadChildren: () =>
          import('../../pages/quan-ly-chat-luong/quan-ly-chat-luong.module').then((m) => m.QuanLyChatLuongModule),
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
