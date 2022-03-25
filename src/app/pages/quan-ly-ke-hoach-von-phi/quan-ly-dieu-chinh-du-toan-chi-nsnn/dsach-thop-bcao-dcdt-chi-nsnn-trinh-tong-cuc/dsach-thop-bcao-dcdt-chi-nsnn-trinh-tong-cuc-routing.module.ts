import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsachThopBcaoDcdtChiNsnnTrinhTongCucComponent } from './dsach-thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: DsachThopBcaoDcdtChiNsnnTrinhTongCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsachThopBcaoDcdtChiNsnnTrinhTongCucRoutingModule {}
