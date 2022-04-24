import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KiemTraTinhTrangPheDuyetBaoCaoTuChiCucComponent } from './kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc.component';


const routes: Routes = [
  {
    path: '',
    component: KiemTraTinhTrangPheDuyetBaoCaoTuChiCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KiemTraTinhTrangPheDuyetBaoCaoTuChiCucRoutingModule {}
