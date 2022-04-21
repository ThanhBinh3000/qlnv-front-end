import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThongTinQDGiaNhapComponent } from './thong-tin-qd-gia-nhap-tc.component';

const routes: Routes = [
  {
    path: '',
    component: ThongTinQDGiaNhapComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThongTinQDGiaNhapRoutingModule {}
