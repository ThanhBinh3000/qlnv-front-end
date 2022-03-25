import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiMuaSamThietBiChuyenDung3NamComponent } from './chi-mua-sam-thiet-bi-chuyen-dung-3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: ChiMuaSamThietBiChuyenDung3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChiMuaSamThietBiChuyenDung3NamRoutingModule {}
