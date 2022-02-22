import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChucvuComponent } from './chucvu.component';

const routes: Routes = [
  {
    path: '',
    component: ChucvuComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChucvuRoutingModule {}
