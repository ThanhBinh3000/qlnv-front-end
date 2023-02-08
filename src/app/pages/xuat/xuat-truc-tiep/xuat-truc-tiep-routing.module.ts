import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XuatTrucTiepComponent } from './xuat-truc-tiep.component';

const routes: Routes = [
  {
    path: '',
    component: XuatTrucTiepComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XuatTrucTiepRoutingModule { }
