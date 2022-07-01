import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsLenhNhapTCComponent } from './ds-lenh-nhap-tc.component';

const routes: Routes = [
  {
    path: '',
    component: DsLenhNhapTCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsLenhNhapTCRoutingModule {}
