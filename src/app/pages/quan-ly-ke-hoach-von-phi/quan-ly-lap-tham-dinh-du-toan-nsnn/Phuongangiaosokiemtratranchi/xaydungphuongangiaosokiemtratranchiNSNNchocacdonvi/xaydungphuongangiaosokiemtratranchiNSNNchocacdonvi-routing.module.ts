import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XaydungphuongangiaosokiemtratranchiNSNNchocacdonviComponent } from './xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi.component';

const routes: Routes = [
  {
    path: '',
    component: XaydungphuongangiaosokiemtratranchiNSNNchocacdonviComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XaydungphuongangiaosokiemtratranchiNSNNchocacdonviRoutingModule {}
