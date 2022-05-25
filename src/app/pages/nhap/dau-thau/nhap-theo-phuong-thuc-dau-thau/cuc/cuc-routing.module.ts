import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CucComponent } from './cuc.component';
import { ThemmoiQdinhNhapXuatHangComponent } from './themmoi-qdinh-nhap-xuat-hang/themmoi-qdinh-nhap-xuat-hang.component';

const routes: Routes = [
  {
    path: '',
    component: CucComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-sach',
        pathMatch: 'full',
      },
      {
        path: '',
        component: CucComponent,
      },
      {
        path: 'thong-tin/:id',
        component: ThemmoiQdinhNhapXuatHangComponent,
      },
      {
        path: 'chi-tiet/:id',
        component: ThemmoiQdinhNhapXuatHangComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CucRoutingModule { }
