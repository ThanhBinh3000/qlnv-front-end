import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapVonChiComponent } from './cap-von-chi.component';

const routes: Routes = [
  {
    path: '',
    component: CapVonChiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapVonChiRoutingModule { }
