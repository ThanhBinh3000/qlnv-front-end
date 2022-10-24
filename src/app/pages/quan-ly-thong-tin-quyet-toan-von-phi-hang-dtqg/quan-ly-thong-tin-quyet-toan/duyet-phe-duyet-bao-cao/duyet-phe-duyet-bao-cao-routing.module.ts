import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DuyetPheDuyetBaoCaoComponent } from './duyet-phe-duyet-bao-cao.component';

const routes: Routes = [
  {
    path: '',
    component: DuyetPheDuyetBaoCaoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [DatePipe],
  exports: [RouterModule],
})
export class DuyetPheDuyetBaoCaoRoutingModule {}
