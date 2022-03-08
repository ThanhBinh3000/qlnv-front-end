import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DieuChinhChiTieuKeHoachNamRoutingModule } from './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc-routing.module';
import { DieuChinhChiTieuKeHoachNamComponent } from './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DieuChinhChiTieuKeHoachNamComponent],
  imports: [CommonModule, DieuChinhChiTieuKeHoachNamRoutingModule, ComponentsModule],
})
export class DieuChinhChiTieuKeHoachNamModule { }
