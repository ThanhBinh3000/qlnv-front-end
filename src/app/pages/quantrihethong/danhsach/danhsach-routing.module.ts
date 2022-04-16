import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachComponent } from './danhsach.component';

const routes: Routes = [
  {
    path: 'danh-sach',
    component: DanhSachComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'danh-sach',
      //   pathMatch: 'full',
      // },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachRoutingModule { }
