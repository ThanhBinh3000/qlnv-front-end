import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapTtTienVonMuaHangVonUngComponent } from './nhap-tt-tien-von-mua-hang-von-ung.component';

const routes: Routes = [
  {
    path: '',
    component: NhapTtTienVonMuaHangVonUngComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapTtTienVonMuaHangVonUngRoutingModule {}
