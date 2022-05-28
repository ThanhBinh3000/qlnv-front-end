import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuyetdinhKetquaLcntComponent } from './quyetdinh-ketqua-lcnt/quyetdinh-ketqua-lcnt.component';
import { ThemmoiQuyetdinhKetquaLcntComponent } from './quyetdinh-ketqua-lcnt/themmoi-quyetdinh-ketqua-lcnt/themmoi-quyetdinh-ketqua-lcnt.component';
import { ThemmoiThongtinDauthauComponent } from './thongtin-dauthau/themmoi-thongtin-dauthau/themmoi-thongtin-dauthau.component';
import { ThongtinDauthauComponent } from './thongtin-dauthau/thongtin-dauthau.component';
import { TrienkhaiLuachonNhathauComponent } from './trienkhai-luachon-nhathau.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'thoc',
    pathMatch: 'full',
  },
  {
    path: ':type',
    component: TrienkhaiLuachonNhathauComponent,
    children: [
      {
        path: 'thongtin-dauthau',
        component: ThongtinDauthauComponent,
      },
      {
        path: 'thongtin-dauthau/them-moi',
        component: ThemmoiThongtinDauthauComponent,
      },
      {
        path: 'thongtin-dauthau/chi-tiet/:id',
        component: ThemmoiThongtinDauthauComponent,
      },
      {
        path: 'thongtin-dauthau/chinh-sua/:id',
        component: ThemmoiThongtinDauthauComponent,
      },
      {
        path: 'ketqua-dauthau',
        component: QuyetdinhKetquaLcntComponent,
      },
      {
        path: 'ketqua-dauthau/them-moi',
        component: ThemmoiQuyetdinhKetquaLcntComponent,
      },
      {
        path: 'ketqua-dauthau/chi/:id',
        component: ThemmoiQuyetdinhKetquaLcntComponent,
      },
      {
        path: 'ketqua-dauthau/chinh-sua/:id',
        component: ThemmoiQuyetdinhKetquaLcntComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrienkhaiLuachonNhathauRoutingModule { }
