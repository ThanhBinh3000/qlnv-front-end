import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThocComponent } from './thoc.component';

const routes: Routes = [
  {
    path: '',
    component: ThocComponent,
    children: [

    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThocRoutingModule { }
