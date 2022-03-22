import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiTietThongTinGoiThauComponent } from './chi-tiet-thong-tin-goi-thau/chi-tiet-thong-tin-goi-thau.component';
import { ChiTietThongTinLCNTComponent } from './chi-tiet-thong-tin-lcnt/chi-tiet-thong-tin-lcnt.component';
import { QuyetDinhPheDuyetKeHoachLCNTComponent } from './quyet-dinh-phe-duyet-ke-hoach-lcnt/quyet-dinh-phe-duyet-ke-hoach-lcnt.component';
import { ThongTinLCNTComponent } from './thong-tin-lcnt/thong-tin-lcnt.component';
import { ThongTinQuyetDinhPheDuyetKeHoachLCNTComponent } from './thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt.component';
import { VatTuComponent } from './vat-tu.component';

const routes: Routes = [
  {
    path: '',
    component: VatTuComponent,
    children: [
      {
        path: 'quyet-dinh-phe-duyet-ke-hoach-lcnt',
        component: QuyetDinhPheDuyetKeHoachLCNTComponent
      },
      {
        path: 'quyet-dinh-phe-duyet-ke-hoach-lcnt/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt/:id',
        component: ThongTinQuyetDinhPheDuyetKeHoachLCNTComponent
      },
      {
        path: 'thong-tin-lcnt',
        component: ThongTinLCNTComponent
      },
      {
        path: 'thong-tin-lcnt/chi-tiet-thong-tin-lcnt/:id',
        component: ChiTietThongTinLCNTComponent
      },
      {
        path: 'thong-tin-lcnt/chi-tiet-thong-tin-goi-thau/:id',
        component: ChiTietThongTinGoiThauComponent
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VatTuRoutingModule { }
