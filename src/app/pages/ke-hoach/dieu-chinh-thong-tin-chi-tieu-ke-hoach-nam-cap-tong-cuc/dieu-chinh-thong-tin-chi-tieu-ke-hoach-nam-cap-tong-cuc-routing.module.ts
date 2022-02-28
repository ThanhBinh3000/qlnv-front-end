import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DieuChinhThongTinChiTieuKeHoachNamComponent } from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: DieuChinhThongTinChiTieuKeHoachNamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DieuChinhThongTinChiTieuKeHoachNamRoutingModule { }
