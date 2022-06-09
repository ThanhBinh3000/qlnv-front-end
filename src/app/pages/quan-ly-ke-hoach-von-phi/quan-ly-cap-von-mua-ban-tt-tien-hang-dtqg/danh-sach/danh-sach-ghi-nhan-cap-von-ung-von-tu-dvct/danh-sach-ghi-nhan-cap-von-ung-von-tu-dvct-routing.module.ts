import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachGhiNhanCapVonUngVonTuDvctComponent } from './danh-sach-ghi-nhan-cap-von-ung-von-tu-dvct.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachGhiNhanCapVonUngVonTuDvctComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachGhiNhanCapVonUngVonTuDvctRoutingModule {}
