import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TienThuaComponent } from './tien-thua.component';

const routes: Routes = [
  {
    path: '',
    component: TienThuaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TienThuaRoutingModule {}
