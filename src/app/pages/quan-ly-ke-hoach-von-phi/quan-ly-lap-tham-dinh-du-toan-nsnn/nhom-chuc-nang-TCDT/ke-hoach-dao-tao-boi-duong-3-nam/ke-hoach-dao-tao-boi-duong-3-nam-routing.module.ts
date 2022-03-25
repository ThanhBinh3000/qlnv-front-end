import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachDaoTaoBoiDuong3NamComponent } from './ke-hoach-dao-tao-boi-duong-3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: KeHoachDaoTaoBoiDuong3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachDaoTaoBoiDuong3NamRoutingModule {}
