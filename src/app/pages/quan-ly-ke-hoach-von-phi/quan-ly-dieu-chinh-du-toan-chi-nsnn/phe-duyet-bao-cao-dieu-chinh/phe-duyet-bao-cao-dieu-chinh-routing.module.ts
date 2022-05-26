import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PheDuyetBaoCaoDieuChinhComponent } from './phe-duyet-bao-cao-dieu-chinh.component';

const routes: Routes = [
  {
    path: '',
    component: PheDuyetBaoCaoDieuChinhComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PheDuyetBaoCaoDieuChinhRoutingModule {}
