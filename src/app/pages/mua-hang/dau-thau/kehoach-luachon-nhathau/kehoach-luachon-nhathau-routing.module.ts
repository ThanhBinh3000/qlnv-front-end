import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachLuachonNhathauComponent } from './kehoach-luachon-nhathau.component';
import { ThemmoiTonghopKhlcntComponent } from './tong-cuc/tong-hop-khlcnt/themmoi-tonghop-khlcnt/themmoi-tonghop-khlcnt.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'thoc',
    pathMatch: 'full',
  },
  {
    path: ':type',
    component: KeHoachLuachonNhathauComponent,
  },
  {
    path: ':type',
    loadChildren: () =>
          import('../../../mua-hang/dau-thau/kehoach-luachon-nhathau/tong-cuc/tong-cuc.module').then((m) => m.TongCucModule),
  },
  {
    path: ':type',
    loadChildren: () =>
          import('../../../mua-hang/dau-thau/kehoach-luachon-nhathau/cuc/cuc.module').then((m) => m.CucModule),
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KehoachLuachonNhathauRoutingModule { }
