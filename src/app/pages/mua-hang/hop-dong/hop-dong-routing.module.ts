import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachHopDongComponent } from './danh-sach-hop-dong/danh-sach-hop-dong.component';
import { ThongTinComponent } from './danh-sach-hop-dong/thong-tin/thong-tin.component';
import { HopDongComponent } from './hop-dong.component';


const routes: Routes = [
  {
    path: '',
    component: HopDongComponent,
    children: [
      {
        path: 'danh-sach',
        component: DanhSachHopDongComponent,
      },
      {
        path: 'danh-sach/thong-tin/:id',
        component: ThongTinComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HopDongRoutingModule { }
