import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaoCaoChatLuongHangDtqgComponent } from './bao-cao-chat-luong-hang-dtqg.component';

const routes: Routes = [
  {
    path: '',
    component: BaoCaoChatLuongHangDtqgComponent,
    /*canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'thong-tu1452013',
            pathMatch: 'full',
          },
          {
            path: 'thong-tu1452013',
            component: ThongTu1452013Component,
            canActivate: [AuthGuard],
          }
        ],*/
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaoCaoChatLuongHangDtqgRoutingModule {
}
