import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemMoiBaoCaoQuyetToanComponent } from './them-moi-bao-cao-quyet-toan.component';

const routes: Routes = [
  {
    path: '',
    component: ThemMoiBaoCaoQuyetToanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemMoiBaoCaoQuyetToanRoutingModule {}
