import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuyetDinhPheDuyetKeHoachLCNTComponent } from './quyet-dinh-phe-duyet-ke-hoach-lcnt/quyet-dinh-phe-duyet-ke-hoach-lcnt.component';
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
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VatTuRoutingModule { }
