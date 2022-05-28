import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachHopDongComponent } from './danh-sach-hop-dong/danh-sach-hop-dong.component';
import { PhuLucComponent } from './danh-sach-hop-dong/phu-luc/phu-luc.component';
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
      {
        path: 'danh-sach/xem-chi-tiet/:id',
        component: ThongTinComponent,
      },
      {
        path: 'danh-sach/phu-luc/:id',
        component: PhuLucComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HopDongRoutingModule { }
