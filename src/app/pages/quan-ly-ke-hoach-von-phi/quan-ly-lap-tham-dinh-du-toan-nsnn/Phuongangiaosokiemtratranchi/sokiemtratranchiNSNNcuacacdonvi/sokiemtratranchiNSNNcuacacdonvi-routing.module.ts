import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SokiemtratranchiNSNNcuacacdonviComponent } from './sokiemtratranchiNSNNcuacacdonvi.component';
const routes: Routes = [
  {
    path: '',
    component: SokiemtratranchiNSNNcuacacdonviComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SokiemtratranchiNSNNcuacacdonviRoutingModule {}
