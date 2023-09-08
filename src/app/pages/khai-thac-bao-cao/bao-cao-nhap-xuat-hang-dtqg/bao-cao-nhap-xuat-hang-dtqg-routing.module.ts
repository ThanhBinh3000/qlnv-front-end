import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaoCaoNhapXuatHangDtqgComponent} from "./bao-cao-nhap-xuat-hang-dtqg.component";

const routes: Routes = [
  {
    path: '',
    component: BaoCaoNhapXuatHangDtqgComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaoCaoNhapXuatHangDtqgRoutingModule { }
