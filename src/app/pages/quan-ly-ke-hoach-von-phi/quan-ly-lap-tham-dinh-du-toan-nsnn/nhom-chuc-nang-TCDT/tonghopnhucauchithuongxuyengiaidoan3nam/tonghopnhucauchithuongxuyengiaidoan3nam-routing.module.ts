import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tonghopnhucauchithuongxuyengiaidoan3namComponent } from './tonghopnhucauchithuongxuyengiaidoan3nam.component';
const routes: Routes = [
  {
    path: '',
    component: Tonghopnhucauchithuongxuyengiaidoan3namComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tonghopnhucauchithuongxuyengiaidoan3namRoutingModule {}
