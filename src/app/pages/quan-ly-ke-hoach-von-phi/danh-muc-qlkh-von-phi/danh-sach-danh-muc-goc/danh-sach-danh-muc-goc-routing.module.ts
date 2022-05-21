import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachDanhMucGocComponent } from './danh-sach-danh-muc-goc.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachDanhMucGocComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachDanhMucGocRoutingModule {}
