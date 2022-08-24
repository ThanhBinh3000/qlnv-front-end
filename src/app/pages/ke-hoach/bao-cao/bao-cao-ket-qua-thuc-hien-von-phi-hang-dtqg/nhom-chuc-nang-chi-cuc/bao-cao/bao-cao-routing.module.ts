import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { BaoCaoComponent } from './bao-cao.component';
const routes: Routes = [
  {
    path: '',
    component: BaoCaoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    { provide: NZ_I18N, useValue: vi_VN },
	DatePipe,
  ]
})
export class BaoCaoRoutingModule {}
