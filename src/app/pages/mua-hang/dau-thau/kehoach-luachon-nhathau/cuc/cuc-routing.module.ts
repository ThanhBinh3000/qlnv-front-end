import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CucComponent } from './cuc.component';
import { DanhsachKehoachLcntComponent } from './danhsach-kehoach-lcnt/danhsach-kehoach-lcnt.component';
import { ThemmoiKehoachLcntComponent } from './danhsach-kehoach-lcnt/themmoi-kehoach-lcnt/themmoi-kehoach-lcnt.component';

const routes: Routes = [
  {
    path: '',
    component: CucComponent,
    children : [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '',
        component: CucComponent,
      },
      {
        path: 'danh-sach',
        component: DanhsachKehoachLcntComponent,
      },
      {
        path: 'them-moi',
        component: ThemmoiKehoachLcntComponent,
      },
      {
        path: 'chinh-sua/:id',
        component: ThemmoiKehoachLcntComponent,
      },
      {
        path: 'chi-tiet/:id',
        component: ThemmoiKehoachLcntComponent,
      },
      // {
      //   path: 'tong-hop',
      //   component: TongHopKhlcntComponent,
      // },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CucRoutingModule { }
