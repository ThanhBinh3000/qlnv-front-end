import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuyetDinhGiaNhapTCComponent } from './quyet-dinh-gia-nhap-tc.component';

const routes: Routes = [
  {
    path: '',
    component: QuyetDinhGiaNhapTCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuyetDinhGiaNhapTCRoutingModule {}
