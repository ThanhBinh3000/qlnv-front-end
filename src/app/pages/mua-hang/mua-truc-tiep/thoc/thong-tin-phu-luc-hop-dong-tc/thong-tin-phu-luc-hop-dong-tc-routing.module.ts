import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThongTinPhuLucHopDongTCComponent } from './thong-tin-phu-luc-hop-dong-tc.component';

const routes: Routes = [
  {
    path: '',
    component: ThongTinPhuLucHopDongTCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThongTinPhuLucHopDongTCRoutingModule {}
