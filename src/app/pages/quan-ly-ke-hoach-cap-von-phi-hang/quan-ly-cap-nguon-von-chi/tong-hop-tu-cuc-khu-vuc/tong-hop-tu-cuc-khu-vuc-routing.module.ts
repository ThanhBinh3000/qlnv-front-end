import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TongHopTuCucKhuVucComponent } from './tong-hop-tu-cuc-khu-vuc.component';

const routes: Routes = [
  {
    path: '',
    component: TongHopTuCucKhuVucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class TongHopTuCucKhuVucRoutingModule {}
