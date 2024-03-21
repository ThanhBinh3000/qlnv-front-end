import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { KhoiTaoDuLieuComponent } from "./khoi-tao-du-lieu.component";
import { HtCongCuDungCuComponent } from './ht-cong-cu-dung-cu/ht-cong-cu-dung-cu.component';

const routes: Routes = [{
  path: '',
  component: KhoiTaoDuLieuComponent,
  // canActivate: [AuthGuard],
  children: [
    {
      path: '',
      redirectTo: 'ht-cong-cu-dung-cu',
      pathMatch: 'full'
    },
    {
      path: 'ht-cong-cu-dung-cu',
      component: HtCongCuDungCuComponent,
    },
    // {
    //   path: 'bao-cao-chat-luong-hang-dtqg',
    //   loadChildren: () =>
    //     import('./bao-cao-chat-luong-hang-dtqg/bao-cao-chat-luong-hang-dtqg.module').then((m) => m.BaoCaoChatLuongHangDtqgModule),
    //   canActivate: [AuthGuard],
    // },
    // {
    //   path: 'bao-cao-nhap-xuat-hang-dtqg',
    //   loadChildren: () =>
    //     import('./bao-cao-nhap-xuat-hang-dtqg/bao-cao-nhap-xuat-hang-dtqg.module').then((m) => m.BaoCaoNhapXuatHangDtqgModule),
    //   canActivate: [AuthGuard],
    // },
    // {
    //   path: 'bao-cao-nghiep-vu-qly-kho',
    //   loadChildren: () =>
    //     import('./bao-cao-nghiep-vu-qly-kho/bao-cao-nghiep-vu-qly-kho.module').then((m) => m.BaoCaoNghiepVuQlyKhoModule),
    //   canActivate: [AuthGuard],
    // }
  ],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KhoiTaoDuLieuRoutingModule {
}
