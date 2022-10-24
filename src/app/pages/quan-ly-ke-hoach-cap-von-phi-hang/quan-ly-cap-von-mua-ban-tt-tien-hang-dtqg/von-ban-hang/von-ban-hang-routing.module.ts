import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VonBanHangComponent } from './von-ban-hang.component';

const routes: Routes = [
  {
    path: '',
    component: VonBanHangComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VonBanHangRoutingModule {}
