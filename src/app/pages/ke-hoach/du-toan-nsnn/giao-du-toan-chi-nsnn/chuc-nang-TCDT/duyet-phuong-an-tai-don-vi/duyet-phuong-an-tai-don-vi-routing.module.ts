import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DuyetPhuongAnTaiDonViComponent } from './duyet-phuong-an-tai-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: DuyetPhuongAnTaiDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DuyetPhuongAnTaiDonViRoutingModule {}
