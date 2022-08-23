import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsBaoCaoTinhHinhSdDtoanThangNamComponent } from './ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam.component';

const routes: Routes = [
  {
    path: '',
    component: DsBaoCaoTinhHinhSdDtoanThangNamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsBaoCaoTinhHinhSdDtoanThangNamRoutingModule {}
