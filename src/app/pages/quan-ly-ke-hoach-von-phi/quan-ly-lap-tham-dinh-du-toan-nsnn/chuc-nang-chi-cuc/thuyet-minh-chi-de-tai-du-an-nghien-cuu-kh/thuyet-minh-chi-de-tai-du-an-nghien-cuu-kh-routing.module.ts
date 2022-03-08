import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThuyetMinhChiDeTaiDuAnNghienCuuKhComponent } from './thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh.component';

const routes: Routes = [
  {
    path: '',
    component: ThuyetMinhChiDeTaiDuAnNghienCuuKhComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThuyetMinhChiDeTaiDuAnNghienCuuKhRoutingModule {}
