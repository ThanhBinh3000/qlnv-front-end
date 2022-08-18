import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ComponentsModule } from 'src/app/components/components.module';
import { KiemTraTinhTrangPheDuyetBaoCaoTuChiCucComponent } from './kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc.component';
import { KiemTraTinhTrangPheDuyetBaoCaoTuChiCucRoutingModule } from './kiem-tra-tinh-trang-phe-duyet-bao-cao-tu-chi-cuc-routing.module';

@NgModule({
  declarations: [KiemTraTinhTrangPheDuyetBaoCaoTuChiCucComponent],
  imports: [CommonModule, KiemTraTinhTrangPheDuyetBaoCaoTuChiCucRoutingModule, ComponentsModule],
  exports:[KiemTraTinhTrangPheDuyetBaoCaoTuChiCucComponent]
})
export class KiemTraTinhTrangPheDuyetBaoCaoTuChiCucModule {}
