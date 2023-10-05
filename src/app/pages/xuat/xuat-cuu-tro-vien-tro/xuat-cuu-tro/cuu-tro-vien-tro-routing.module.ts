import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuuTroVienTroComponent } from './cuu-tro-vien-tro.component';

const routes: Routes = [
  {
    path: '',
    component: CuuTroVienTroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuuTroVienTroRoutingModule { }
