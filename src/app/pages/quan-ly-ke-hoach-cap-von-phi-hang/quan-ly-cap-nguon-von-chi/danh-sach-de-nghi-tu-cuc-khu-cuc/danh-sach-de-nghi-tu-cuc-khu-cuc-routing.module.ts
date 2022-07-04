import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachDeNghiTuCucKhuVucComponent } from './danh-sach-de-nghi-tu-cuc-khu-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachDeNghiTuCucKhuVucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class DanhSachDeNghiTuCucKhuVucRoutingModule {}
