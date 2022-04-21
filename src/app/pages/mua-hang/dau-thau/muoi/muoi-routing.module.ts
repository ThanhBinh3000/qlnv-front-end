import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuoiComponent } from './muoi.component';

const routes: Routes = [
  {
    path: '',
    component: MuoiComponent,
    children: [

    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MuoiRoutingModule { }
