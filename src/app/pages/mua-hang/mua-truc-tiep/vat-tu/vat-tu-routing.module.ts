import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VatTuComponent } from './vat-tu.component';

const routes: Routes = [
  {
    path: '',
    component: VatTuComponent,
    children: [

    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VatTuRoutingModule { }
