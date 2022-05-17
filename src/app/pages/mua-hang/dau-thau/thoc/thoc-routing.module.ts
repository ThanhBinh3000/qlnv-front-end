import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LuongDauThauGaoComponent } from './luong-dau-thau-gao/luong-dau-thau-gao.component';
import { ThocComponent } from './thoc.component';
import { ThongTinLuongDauThauGaoComponent } from './thong-tin-luong-dau-thau-gao/thong-tin-luong-dau-thau-gao.component';

const routes: Routes = [
  {
    path: '',
    component: ThocComponent,
    children: [
      {
        path: 'tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc',
        component: LuongDauThauGaoComponent,
      },
      {
        path: 'tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc/thong-tin-tong-hop-ke-hoach-lua-chon-nha-thau-tong-cuc/:id',
        component: ThongTinLuongDauThauGaoComponent,
      },
      {
        path: 'tong-hop-ke-hoach-lua-chon-nha-thau-cuc',
        component: LuongDauThauGaoComponent,
      },
      {
        path: 'tong-hop-ke-hoach-lua-chon-nha-thau-cuc/thong-tin-tong-hop-ke-hoach-lua-chon-nha-thau-cuc/:id',
        component: ThongTinLuongDauThauGaoComponent,
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThocRoutingModule { }
