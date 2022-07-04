import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeNghiTheoQuyetDinhDonGiaMuaComponent } from './de-nghi-theo-quyet-dinh-don-gia-mua.component';

const routes: Routes = [
  {
    path: '',
    component: DeNghiTheoQuyetDinhDonGiaMuaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class DeNghiTheoQuyetDinhDonGiaMuaRoutingModule {}
