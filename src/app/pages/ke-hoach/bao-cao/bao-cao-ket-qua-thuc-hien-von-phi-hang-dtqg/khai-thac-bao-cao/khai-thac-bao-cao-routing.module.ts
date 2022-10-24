import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KhaiThacBaoCaoComponent } from './khai-thac-bao-cao.component';

const routes: Routes = [
  {
    path: '',
    component: KhaiThacBaoCaoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KhaiThacBaoCaoRoutingModule {}
