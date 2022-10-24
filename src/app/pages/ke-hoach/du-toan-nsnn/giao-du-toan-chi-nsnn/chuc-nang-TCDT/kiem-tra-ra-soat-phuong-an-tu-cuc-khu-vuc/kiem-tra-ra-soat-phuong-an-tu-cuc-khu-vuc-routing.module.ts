import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KiemTraRaSoatPhuongAnTuCucKhuVucComponent } from './kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc.component';

const routes: Routes = [
  {
    path: '',
    component: KiemTraRaSoatPhuongAnTuCucKhuVucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KiemTraRaSoatPhuongAnTuCucKhuVucRoutingModule {}
