import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapQuyetDinhCuaTongCucVaPhanBoChoCacDonViComponent } from './nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi.component';
const routes: Routes = [
  {
    path: '',
    component: NhapQuyetDinhCuaTongCucVaPhanBoChoCacDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapQuyetDinhCuaTongCucVaPhanBoChoCacDonViRoutingModule {}
