import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimkiemphuonganQDCVgiaosokiemtraNSNNRoutingModule } from './timkiemphuonganQDCVgiaosokiemtraNSNN-routing.module';
import { TimkiemphuonganQDCVgiaosokiemtraNSNNComponent } from './timkiemphuonganQDCVgiaosokiemtraNSNN.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TimkiemphuonganQDCVgiaosokiemtraNSNNComponent],
  imports: [CommonModule, TimkiemphuonganQDCVgiaosokiemtraNSNNRoutingModule, ComponentsModule],
})
export class TimkiemphuonganQDCVgiaosokiemtraNSNNModule {}
