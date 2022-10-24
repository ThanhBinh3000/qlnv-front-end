import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TongHopBCTinhHinhSuDungDuToanTuCCComponent } from './tong-hop-bc-tinh-hinh-su-dung-du-toan-tu-CC.component';

const routes: Routes = [
  {
    path: '',
    component: TongHopBCTinhHinhSuDungDuToanTuCCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TongHopBCTinhHinhSuDungDuToanTuCCRoutingModule {}
