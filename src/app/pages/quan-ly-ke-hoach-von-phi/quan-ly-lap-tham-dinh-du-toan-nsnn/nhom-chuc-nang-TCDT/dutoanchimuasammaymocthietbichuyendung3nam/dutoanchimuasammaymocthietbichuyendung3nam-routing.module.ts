import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dutoanchimuasammaymocthietbichuyendung3namComponent } from './dutoanchimuasammaymocthietbichuyendung3nam.component';

const routes: Routes = [
  {
    path: '',
    component: Dutoanchimuasammaymocthietbichuyendung3namComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Dutoanchimuasammaymocthietbichuyendung3namRoutingModule {}
