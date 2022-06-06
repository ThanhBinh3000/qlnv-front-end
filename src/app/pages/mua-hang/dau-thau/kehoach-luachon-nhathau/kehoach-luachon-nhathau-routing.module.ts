import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachLuachonNhathauComponent } from './kehoach-luachon-nhathau.component';
import { ThemmoiTonghopKhlcntComponent } from './tong-cuc/tong-hop-khlcnt/themmoi-tonghop-khlcnt/themmoi-tonghop-khlcnt.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: KeHoachLuachonNhathauComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KehoachLuachonNhathauRoutingModule { }
