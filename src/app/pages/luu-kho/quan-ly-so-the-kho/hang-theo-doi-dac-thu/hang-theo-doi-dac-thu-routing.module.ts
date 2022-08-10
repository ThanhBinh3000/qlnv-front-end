import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HangTheoDoiDacThuComponent } from './hang-theo-doi-dac-thu.component';

const routes: Routes = [
  {
    path: '',
    component: HangTheoDoiDacThuComponent,
    children: [
      {
        path: '',
        redirectTo: 'hang-thuoc-dien-thanh-ly',
        pathMatch: 'full',
      },
      {
        path: 'hang-thuoc-dien-thanh-ly',
        loadChildren: () =>
          import(
            '../hang-theo-doi-dac-thu/hang-thuoc-dien-thanh-ly/hang-thuoc-dien-thanh-ly.module'
          ).then((m) => m.HangThuocDienThanhLyModule),
      },
      {
        path: 'hang-thuoc-dien-tieu-huy',
        loadChildren: () =>
          import(
            '../hang-theo-doi-dac-thu/hang-thuoc-dien-tieu-huy/hang-thuoc-dien-tieu-huy.module'
          ).then((m) => m.HangThuocDienTieuHuyModule),
      },
      {
        path: 'hang-sap-het-han-bao-hanh',
        loadChildren: () =>
          import(
            '../hang-theo-doi-dac-thu/hang-sap-het-han-bao-hanh/hang-sap-het-han-bao-hanh.module'
          ).then((m) => m.HangSapHetHanBaoHanhModule),
      },
      {
        path: 'hang-sap-het-han-luu-kho',
        loadChildren: () =>
          import(
            '../hang-theo-doi-dac-thu/hang-sap-het-han-luu-kho/hang-sap-het-han-luu-kho.module'
          ).then((m) => m.HangSapHetHanLuuKhoModule),
      },
      {
        path: 'hang-hong-hoc-giam-chat-luong',
        loadChildren: () =>
          import(
            '../hang-theo-doi-dac-thu/hang-hong-hoc-giam-chat-luong/hang-hong-hoc-giam-chat-luong.module'
          ).then((m) => m.HangHongHocGiamChatLuongModule),
      },
      {
        path: 'hang-hong-can-bao-hanh',
        loadChildren: () =>
          import(
            '../hang-theo-doi-dac-thu/hang-hong-can-bao-hanh/hang-hong-can-bao-hanh.module'
          ).then((m) => m.HangHongCanBaoHanhModule),
      },
      {
        path: 'hang-dtqg-het-han-bao-hanh',
        loadChildren: () =>
          import(
            '../hang-theo-doi-dac-thu/hang-dtqg-het-han-bao-hanh/hang-dtqg-het-han-bao-hanh.module'
          ).then((m) => m.HangDtqgHetHanBaoHanhModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HangTheoDoiDacThuRoutingModule {}
