import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { DeNghiTheoQuyetDinhDonGiaMuaRoutingModule } from './de-nghi-theo-quyet-dinh-don-gia-mua-routing.module';
import { DeNghiTheoQuyetDinhDonGiaMuaComponent } from './de-nghi-theo-quyet-dinh-don-gia-mua.component';

@NgModule({
  declarations: [DeNghiTheoQuyetDinhDonGiaMuaComponent],
  imports: [CommonModule, DeNghiTheoQuyetDinhDonGiaMuaRoutingModule, ComponentsModule],
})
export class DeNghiTheoQuyetDinhDonGiaMuaModule {}
