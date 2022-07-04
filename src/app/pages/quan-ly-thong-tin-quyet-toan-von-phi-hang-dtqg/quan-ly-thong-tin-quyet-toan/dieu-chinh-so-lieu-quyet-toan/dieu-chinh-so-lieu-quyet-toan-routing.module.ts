import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DieuChinhSoLieuQuyetToanComponent } from './dieu-chinh-so-lieu-quyet-toan.component';

const routes: Routes = [
  {
    path: '',
    component: DieuChinhSoLieuQuyetToanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [DatePipe],
  exports: [RouterModule],
})
export class DieuChinhSoLieuQuyetToanRoutingModule {}
