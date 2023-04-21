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
        redirectTo: 'quyet-dinh-dieu-chuyen',
        pathMatch: 'full',
      },
      {
        path: 'ke-hoach-dieu-chuyen',
        component: KeHoachDieuChuyenComponent,
      },
      {
        path: 'quyet-dinh-dieu-chuyen',
        loadChildren: () =>
          import(
            '../dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen.module'
          ).then((m) => m.QuyetDinhDieuChuyenModule),
      },
    ]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DieuChuyenNoiBoRoutingModule {
}
