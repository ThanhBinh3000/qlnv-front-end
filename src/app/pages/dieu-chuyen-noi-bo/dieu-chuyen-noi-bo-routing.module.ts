import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachDieuChuyenComponent } from "./ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.component";
import { DieuChuyenNoiBoComponent } from "./dieu-chuyen-noi-bo.component";
import { TongHopDieuChuyenTaiCuc } from './tong-hop-dieu-chuyen-tai-cuc/tong-hop-dieu-chuyen-tai-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: DieuChuyenNoiBoComponent,
    children: [
      {
        path: '',
        redirectTo: 'ke-hoach-dieu-chuyen',
        pathMatch: 'full',
      },
      {
        path: 'ke-hoach-dieu-chuyen',
        component: KeHoachDieuChuyenComponent,
      },
      {
        path: 'tong-hop-dieu-chuyen-tai-cuc',
        component: TongHopDieuChuyenTaiCuc
      }
    ]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DieuChuyenNoiBoRoutingModule {
}
