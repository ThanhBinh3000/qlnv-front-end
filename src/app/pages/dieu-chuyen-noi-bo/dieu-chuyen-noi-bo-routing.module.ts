import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KeHoachDieuChuyenComponent} from "./ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.component";
import {DieuChuyenNoiBoComponent} from "./dieu-chuyen-noi-bo.component";
import {
  ChiTietKeHoachDcnbComponent
} from "./ke-hoach-dieu-chuyen/chi-tiet-ke-hoach-dcnb/chi-tiet-ke-hoach-dcnb.component";

const routes: Routes = [
  {
    path: '',
    component: DieuChuyenNoiBoComponent,
    children: [
      {
        path: '',
        redirectTo: 'chi-tiet-ke-hoach-dieu-chuyen',
        pathMatch: 'full',
      },
      {
        path: 'ke-hoach-dieu-chuyen',
        component: KeHoachDieuChuyenComponent,
      },
      {
        path: 'chi-tiet-ke-hoach-dieu-chuyen',
        component: ChiTietKeHoachDcnbComponent,
      },
    ]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DieuChuyenNoiBoRoutingModule {
}
