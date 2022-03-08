import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhMucDonViComponent } from './danh-muc-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: DanhMucDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhMucDonViRoutingModule {}
