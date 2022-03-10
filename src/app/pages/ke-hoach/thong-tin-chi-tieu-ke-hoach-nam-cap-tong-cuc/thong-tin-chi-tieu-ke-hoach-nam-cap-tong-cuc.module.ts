import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThongTinChiTieuKeHoachNamRoutingModule } from './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc-routing.module';
import { ThongTinChiTieuKeHoachNamComponent } from './thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    ThongTinChiTieuKeHoachNamComponent,
  ],
  imports: [
    CommonModule,
    ThongTinChiTieuKeHoachNamRoutingModule,
    ComponentsModule,
  ],
})
export class ThongTinChiTieuKeHoachNamModule { }
