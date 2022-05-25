import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhuongAnKhlcntComponent } from './phuong-an-khlcnt/phuong-an-khlcnt.component';
import { ThemmoiPhuonganKhlcntComponent } from './phuong-an-khlcnt/themmoi-phuongan-khlcnt/themmoi-phuongan-khlcnt.component';
import { QuyetdinhPheduyetKhlcntComponent } from './quyetdinh-pheduyet-khlcnt/quyetdinh-pheduyet-khlcnt.component';
import { ThemmoiQuyetdinhKhlcntComponent } from './quyetdinh-pheduyet-khlcnt/themmoi-quyetdinh-khlcnt/themmoi-quyetdinh-khlcnt.component';
import { TongCucComponent } from './tong-cuc.component';
import { ThemmoiTonghopKhlcntComponent } from './tong-hop-khlcnt/themmoi-tonghop-khlcnt/themmoi-tonghop-khlcnt.component';
import { TongHopKhlcntComponent } from './tong-hop-khlcnt/tong-hop-khlcnt.component';

const routes: Routes = [
  {
    path: '',
    component: TongCucComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '',
        component: TongCucComponent,
      },
      {
        path: 'tong-hop',
        component: TongHopKhlcntComponent,
      },
      {
        path: 'tong-hop/them-moi',
        component: ThemmoiTonghopKhlcntComponent,
      },
      {
        path: 'tong-hop/chi-tiet/:id',
        component: ThemmoiTonghopKhlcntComponent,
      },
      {
        path: 'phuong-an',
        component: PhuongAnKhlcntComponent,
      },
      {
        path: 'phuong-an/them-moi',
        component: ThemmoiPhuonganKhlcntComponent,
      },
      {
        path: 'phe-duyet',
        component: QuyetdinhPheduyetKhlcntComponent,
      },
      {
        path: 'phe-duyet/them-moi',
        component: ThemmoiQuyetdinhKhlcntComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TongCucRoutingModule { }
