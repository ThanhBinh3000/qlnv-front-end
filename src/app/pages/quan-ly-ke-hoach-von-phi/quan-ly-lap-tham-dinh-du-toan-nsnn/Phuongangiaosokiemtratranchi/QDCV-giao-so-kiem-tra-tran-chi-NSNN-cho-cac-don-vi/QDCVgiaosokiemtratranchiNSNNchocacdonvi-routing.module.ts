import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QDCVgiaosokiemtratranchiNSNNchocacdonviComponent } from './QDCVgiaosokiemtratranchiNSNNchocacdonvi.component';
const routes: Routes = [
  {
    path: '',
    component: QDCVgiaosokiemtratranchiNSNNchocacdonviComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QDCVgiaosokiemtratranchiNSNNchocacdonviRoutingModule {}
