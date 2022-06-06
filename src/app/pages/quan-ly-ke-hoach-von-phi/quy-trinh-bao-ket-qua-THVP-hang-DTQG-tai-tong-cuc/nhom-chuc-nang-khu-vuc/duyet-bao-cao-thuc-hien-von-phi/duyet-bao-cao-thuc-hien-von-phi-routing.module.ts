import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DuyetBaoCaoThucHienVonPhiComponent } from './duyet-bao-cao-thuc-hien-von-phi.component';


const routes: Routes = [
  {
    path: '',
    component: DuyetBaoCaoThucHienVonPhiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuyetBaoCaoThucHienVonPhiRoutingModule {}
