import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachDuToanCaiTaoSuaChuaHtKt3NamComponent } from './ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: KeHoachDuToanCaiTaoSuaChuaHtKt3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachDuToanCaiTaoSuaChuaHtKt3NamRoutingModule {}
