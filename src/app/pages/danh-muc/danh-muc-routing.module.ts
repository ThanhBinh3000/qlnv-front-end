import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { DanhMucTieuChuanHangDtqgComponent } from './danh-muc-tieu-chuan-hang-dtqg/danh-muc-tieu-chuan-hang-dtqg.component';
import { DanhMucComponent } from './danh-muc.component';

const routes: Routes = [
  {
    path: '',
    component: DanhMucComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'danh-muc-don-vi',
        pathMatch: 'full',
      },
      {
        path: 'danh-muc-tieu-chuan-hang-dtqg',
        component: DanhMucTieuChuanHangDtqgComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhMucRoutingModule { }
