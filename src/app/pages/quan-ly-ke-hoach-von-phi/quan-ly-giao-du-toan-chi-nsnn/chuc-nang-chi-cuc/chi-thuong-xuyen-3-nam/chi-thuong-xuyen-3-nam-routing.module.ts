import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiThuongXuyen3NamComponent } from './chi-thuong-xuyen-3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: ChiThuongXuyen3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChiThuongXuyen3NamRoutingModule {}
