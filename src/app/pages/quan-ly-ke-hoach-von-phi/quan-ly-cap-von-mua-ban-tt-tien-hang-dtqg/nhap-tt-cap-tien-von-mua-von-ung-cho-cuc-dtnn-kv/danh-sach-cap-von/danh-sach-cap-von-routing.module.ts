import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachCapVonComponent } from './danh-sach-cap-von.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachCapVonComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachCapVonRoutingModule {}
