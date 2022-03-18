import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsNhanGhiNhanThongTinPboDuAnComponent } from './ds-nhan-ghi-nhan-thong-tin-pbo-du-toan.component';
const routes: Routes = [
  {
    path: '',
    component: DsNhanGhiNhanThongTinPboDuAnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsNhanGhiNhanThongTinPboDuAnRoutingModule {}
