import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhanGhiNhanThongTinPboDuAnComponent } from './nhan-ghi-nhan-thong-tin-pbo-du-an.component';

const routes: Routes = [
  {
    path: '',
    component: NhanGhiNhanThongTinPboDuAnComponent
    ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhanGhiNhanThongTinPboDuAnRoutingModule {}
