import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuyetDinhDieuChuyenComponent } from './quyet-dinh-dieu-chuyen.component';

const routes: Routes = [
  {
    path: '',
    component: QuyetDinhDieuChuyenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuyetDinhDieuChuyenRoutingModule { }
