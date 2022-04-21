import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GaoComponent } from './gao.component';

const routes: Routes = [
  {
    path: '',
    component: GaoComponent,
    children: [

    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GaoRoutingModule { }
