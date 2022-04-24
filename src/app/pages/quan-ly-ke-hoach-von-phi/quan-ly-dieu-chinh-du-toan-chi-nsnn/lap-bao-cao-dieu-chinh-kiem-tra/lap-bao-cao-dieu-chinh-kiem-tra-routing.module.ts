import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LapBaoCaoDieuChinhKiemTraComponent } from './lap-bao-cao-dieu-chinh-kiem-tra.component';

const routes: Routes = [
  {
    path: '',
    component: LapBaoCaoDieuChinhKiemTraComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapBaoCaoDieuChinhKiemTraRoutingModule {}
