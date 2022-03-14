import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LapDuToanChiNganSachChoDonViComponent } from './lap-du-toan-chi-ngan-sach-cho-don-vi.component';
const routes: Routes = [
  {
    path: '',
    component: LapDuToanChiNganSachChoDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapDuToanChiNganSachChoDonViRoutingModule {}
