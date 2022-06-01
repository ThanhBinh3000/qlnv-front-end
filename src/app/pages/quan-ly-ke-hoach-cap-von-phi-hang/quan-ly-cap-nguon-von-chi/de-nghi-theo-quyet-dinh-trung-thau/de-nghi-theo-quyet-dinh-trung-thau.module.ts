import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeNghiTheoQuyetDinhTrungThauRoutingModule } from './de-nghi-theo-quyet-dinh-trung-thau-routing.module';
import { DeNghiTheoQuyetDinhTrungThauComponent } from './de-nghi-theo-quyet-dinh-trung-thau.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DeNghiTheoQuyetDinhTrungThauComponent],
  imports: [CommonModule, DeNghiTheoQuyetDinhTrungThauRoutingModule, ComponentsModule],
})
export class DeNghiTheoQuyetDinhTrungThauModule {}
