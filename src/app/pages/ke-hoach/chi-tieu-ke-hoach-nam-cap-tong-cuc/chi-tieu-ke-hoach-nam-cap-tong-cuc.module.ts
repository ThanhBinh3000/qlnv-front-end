import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChiTieuKeHoachNamRoutingModule } from './chi-tieu-ke-hoach-nam-cap-tong-cuc-routing.module';
import { ChiTieuKeHoachNamComponent } from './chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [ChiTieuKeHoachNamComponent],
  imports: [CommonModule, ChiTieuKeHoachNamRoutingModule, ComponentsModule],
})
export class ChiTieuKeHoachNamModule {}
