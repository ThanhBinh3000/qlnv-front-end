import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DauGiaBanHangComponent } from './dau-gia.component';


const routes: Routes = [
  {
    path: '',
    component: DauGiaBanHangComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauGiaRoutingModule { }
