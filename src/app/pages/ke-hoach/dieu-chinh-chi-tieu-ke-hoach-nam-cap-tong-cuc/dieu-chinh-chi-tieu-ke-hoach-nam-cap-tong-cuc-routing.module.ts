import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DieuChinhChiTieuKeHoachNamComponent } from './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: DieuChinhChiTieuKeHoachNamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DieuChinhChiTieuKeHoachNamRoutingModule { }
