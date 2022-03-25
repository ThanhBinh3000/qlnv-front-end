import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimkiemphuonganQDCVgiaosokiemtraNSNNComponent } from './timkiemphuonganQDCVgiaosokiemtraNSNN.component';
const routes: Routes = [
  {
    path: '',
    component: TimkiemphuonganQDCVgiaosokiemtraNSNNComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimkiemphuonganQDCVgiaosokiemtraNSNNRoutingModule {}
