import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DauThauComponent } from './dau-thau.component';


const routes: Routes = [
  {
    path: '',
    component: DauThauComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DauThauRoutingModule { }
