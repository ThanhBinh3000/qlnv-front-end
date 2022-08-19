import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsBaoCaoTinhHinhSdDtoanThangNamTuCCComponent } from './ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC.component';

const routes: Routes = [
  {
    path: '',
    component: DsBaoCaoTinhHinhSdDtoanThangNamTuCCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsBaoCaoTinhHinhSdDtoanThangNamTuCCRoutingModule {}
