import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiTieuKeHoachNamComponent } from './chi-tieu-ke-hoach-nam-cap-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: ChiTieuKeHoachNamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChiTieuKeHoachNamRoutingModule {}
