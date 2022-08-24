import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachNopTienThuaComponent } from './danh-sach-nop-tien-thua.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachNopTienThuaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachNopTienThuaRoutingModule {}
