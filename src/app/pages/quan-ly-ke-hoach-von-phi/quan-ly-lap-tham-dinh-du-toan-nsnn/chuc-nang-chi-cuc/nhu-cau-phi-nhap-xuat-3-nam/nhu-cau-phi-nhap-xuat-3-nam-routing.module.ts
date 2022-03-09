import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhuCauPhiNhapXuat3NamComponent } from './nhu-cau-phi-nhap-xuat-3-nam.component';

const routes: Routes = [
  {
    path: '',
    component: NhuCauPhiNhapXuat3NamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhuCauPhiNhapXuat3NamRoutingModule {}
