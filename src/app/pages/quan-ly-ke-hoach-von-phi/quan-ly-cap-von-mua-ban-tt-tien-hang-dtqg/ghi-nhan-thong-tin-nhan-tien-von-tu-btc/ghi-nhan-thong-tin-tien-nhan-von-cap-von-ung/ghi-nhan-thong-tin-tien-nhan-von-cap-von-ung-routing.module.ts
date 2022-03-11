import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhiNhanThongTinTienNhanVonCapVonUngComponent } from './ghi-nhan-thong-tin-tien-nhan-von-cap-von-ung.component';

const routes: Routes = [
  {
    path: '',
    component: GhiNhanThongTinTienNhanVonCapVonUngComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GhiNhanThongTinTienNhanVonCapVonUngRoutingModule {}
