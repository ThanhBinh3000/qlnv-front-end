import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThongTinChiTieuKeHoachNamComponent } from './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: ThongTinChiTieuKeHoachNamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThongTinChiTieuKeHoachNamRoutingModule {}
