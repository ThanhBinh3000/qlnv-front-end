import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThopBcaoDcdtChiNsnnTrinhTongCucComponent } from './thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: ThopBcaoDcdtChiNsnnTrinhTongCucComponent
    ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThopBcaoDcdtChiNsnnTrinhTongCucRoutingModule {}
