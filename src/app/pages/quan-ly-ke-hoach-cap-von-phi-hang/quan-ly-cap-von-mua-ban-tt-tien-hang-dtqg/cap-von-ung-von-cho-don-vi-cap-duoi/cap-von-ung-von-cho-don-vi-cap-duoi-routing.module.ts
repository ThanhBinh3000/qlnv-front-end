import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapVonUngVonChoDonViCapDuoiComponent } from './cap-von-ung-von-cho-don-vi-cap-duoi.component';

const routes: Routes = [
  {
    path: '',
    component: CapVonUngVonChoDonViCapDuoiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CapVonUngVonChoDonViCapDuoiRoutingModule {}
