import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonviComponent } from './donvi.component';

const routes: Routes = [
  { 
    path: '', 
    component: DonviComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonviRoutingModule { }
