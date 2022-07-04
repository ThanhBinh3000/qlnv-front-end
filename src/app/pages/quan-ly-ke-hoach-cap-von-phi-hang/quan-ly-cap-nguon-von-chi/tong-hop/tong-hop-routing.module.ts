import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TongHopComponent } from './tong-hop.component';

const routes: Routes = [
  {
    path: '',
    component: TongHopComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class TonghopRoutingModule {}
