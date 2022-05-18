import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachLuachonNhathauComponent } from './kehoach-luachon-nhathau.component';
import { LuongThucComponent } from './luong-thuc/luong-thuc.component';

const routes: Routes = [
  {
    path: '',
    component: KeHoachLuachonNhathauComponent,
    children: [
      {
        path: '',
        redirectTo: 'thoc',
        pathMatch: 'full',
      },
      {
        path: ':type',
        component: LuongThucComponent,
      },
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KehoachLuachonNhathauRoutingModule { }
