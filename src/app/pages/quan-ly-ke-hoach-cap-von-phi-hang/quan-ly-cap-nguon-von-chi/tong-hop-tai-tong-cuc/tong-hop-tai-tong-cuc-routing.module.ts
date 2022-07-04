import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TongHopTaiTongCucComponent } from './tong-hop-tai-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: TongHopTaiTongCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class TongHopTaiTongCucRoutingModule {}
