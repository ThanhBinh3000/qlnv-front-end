import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tonghopnhucauchingansachnhanuocgiadoan3namComponent } from './tonghopnhucauchingansachnhanuocgiadoan3nam.component';
const routes: Routes = [
  {
    path: '',
    component: Tonghopnhucauchingansachnhanuocgiadoan3namComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tonghopnhucauchingansachnhanuocgiadoan3namRoutingModule {}
