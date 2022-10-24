import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PheDuyetComponent } from './phe-duyet.component';

const routes: Routes = [
  {
    path: '',
    component: PheDuyetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PheDuyetRoutingModule {}
