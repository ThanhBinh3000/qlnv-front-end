import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimkiemsokiemtratranchiNSNNcuacacdonviComponent } from './timkiemsokiemtratranchiNSNNcuacacdonvi.component';
const routes: Routes = [
  {
    path: '',
    component: TimkiemsokiemtratranchiNSNNcuacacdonviComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimkiemsokiemtratranchiNSNNcuacacdonviRoutingModule {}
