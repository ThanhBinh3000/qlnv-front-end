import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachDieuChuyenComponent } from "./ke-hoach-dieu-chuyen/ke-hoach-dieu-chuyen.component";
import { DieuChuyenNoiBoComponent } from "./dieu-chuyen-noi-bo.component";

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
    ]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DieuChuyenNoiBoRoutingModule {
}
