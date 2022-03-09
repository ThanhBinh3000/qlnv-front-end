import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachBaoQuanHangNamComponent } from './ke-hoach-bao-quan-hang-nam.component';

const routes: Routes = [
  {
    path: '',
    component: KeHoachBaoQuanHangNamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachBaoQuanHangNamRoutingModule {}
