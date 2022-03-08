import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Chitietnhucauchithuongxuyengiaidoan3namComponent } from './chitietnhucauchithuongxuyengiaidoan3nam.component';
const routes: Routes = [
  {
    path: '',
    component: Chitietnhucauchithuongxuyengiaidoan3namComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Chitietnhucauchithuongxuyengiaidoan3namRoutingModule {}
