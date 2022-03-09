import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimKiemComponent } from './tim-kiem.component';

const routes: Routes = [
  {
    path: '',
    component: TimKiemComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemRoutingModule {}
