import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsQuyetDinhComponent } from './ds-quyet-dinh.component';
const routes: Routes = [
  {
    path: '',
    component: DsQuyetDinhComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsQuyetDinhRoutingModule {}
